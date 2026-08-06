"use server";

import { getTokenRoles } from "@/lib/auth/get-token-roles";
import {
  createSupabaseServerActionAdminClient,
  createActiveSupabaseServerActionClient,
} from "@/lib/supabase/server-action";
import { randomUUID } from "crypto";

const MAX_PAYMENT_IMAGE_SIZE = 3 * 1024 * 1024;
const PAYMENT_IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const REVIEW_MODES = ["online", "in-house"] as const;

export const updateReviewee = async (formData: FormData) => {
  let uploadedPaymentImagePath: string | null = null;
  const supabaseAdmin = createSupabaseServerActionAdminClient();

  try {
    const userId = String(formData.get("userId") ?? "").trim();
    const fullName = String(formData.get("fullName") ?? "").trim();
    const modeOfReview = String(formData.get("modeOfReview") ?? "").toLowerCase();
    const status = String(formData.get("status") ?? "").toLowerCase();
    const paymentImageValue = formData.get("paymentImage");
    const paymentImage =
      paymentImageValue instanceof File && paymentImageValue.size > 0
        ? paymentImageValue
        : null;

    if (!userId || !fullName || !modeOfReview || !status) {
      throw new Error("Full name, mode of review, and status are required");
    }

    if (!REVIEW_MODES.includes(modeOfReview as (typeof REVIEW_MODES)[number])) {
      throw new Error("Mode of review must be online or in-house");
    }

    if (paymentImageValue !== null && !paymentImage) {
      throw new Error("Choose a valid proof of payment image");
    }

    const paymentImageExtension = paymentImage
      ? PAYMENT_IMAGE_EXTENSIONS[paymentImage.type]
      : null;

    if (paymentImage && !paymentImageExtension) {
      throw new Error("Proof of payment must be a PNG, JPEG, or WebP image");
    }

    if (paymentImage && paymentImage.size > MAX_PAYMENT_IMAGE_SIZE) {
      throw new Error("Proof of payment must not exceed 3 MB");
    }

    const supabase = await createActiveSupabaseServerActionClient();
    const {
      data: { user: currentUser },
      error: currentUserError,
    } = await supabase.auth.getUser();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (currentUserError || !currentUser || !session) {
      throw new Error("You must be logged in to edit a reviewee");
    }

    if (!getTokenRoles(session).includes("admin")) {
      throw new Error("You are not authorized to edit reviewees");
    }

    const { data: reviewee, error: revieweeError } = await supabaseAdmin
      .from("users")
      .select(
        "full_name, mode_of_review, status, payments(image_path), user_roles!inner(roles!inner(name))",
      )
      .eq("user_id", userId)
      .eq("user_roles.roles.name", "reviewee")
      .single();

    if (revieweeError || !reviewee) {
      throw new Error("Reviewee not found");
    }

    const currentStatus = reviewee.status.toLowerCase();
    const allowedStatuses = ["active", "inactive"].includes(currentStatus)
      ? ["active", "inactive"]
      : [currentStatus];

    if (!allowedStatuses.includes(status)) {
      throw new Error(
        currentStatus === "pending"
          ? "A pending reviewee's status cannot be changed"
          : "This reviewee's status cannot be changed",
      );
    }

    if (paymentImage && paymentImageExtension) {
      uploadedPaymentImagePath = `payment-images/${userId}/${randomUUID()}.${paymentImageExtension}`;
      const { error: uploadError } = await supabaseAdmin.storage
        .from("payments")
        .upload(uploadedPaymentImagePath, paymentImage, {
          contentType: paymentImage.type,
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }
    }

    const { error: updateRevieweeError } = await supabaseAdmin
      .from("users")
      .update({
        full_name: fullName,
        mode_of_review: modeOfReview,
        status,
      })
      .eq("user_id", userId);

    if (updateRevieweeError) {
      throw new Error(updateRevieweeError.message);
    }

    const {
      data: { user: authUser },
      error: authUserError,
    } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (authUserError || !authUser) {
      const { error: rollbackRevieweeError } = await supabaseAdmin
        .from("users")
        .update({
          full_name: reviewee.full_name,
          mode_of_review: reviewee.mode_of_review,
          status: reviewee.status,
        })
        .eq("user_id", userId);
      const accountErrorMessage =
        authUserError?.message ?? "Reviewee account not found";

      throw new Error(
        rollbackRevieweeError
          ? `${accountErrorMessage}. Reviewee profile rollback failed: ${rollbackRevieweeError.message}`
          : accountErrorMessage,
      );
    }

    const { error: updateAuthUserError } =
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: {
          ...authUser.user_metadata,
          full_name: fullName,
        },
      });

    if (updateAuthUserError) {
      const { error: rollbackRevieweeError } = await supabaseAdmin
        .from("users")
        .update({
          full_name: reviewee.full_name,
          mode_of_review: reviewee.mode_of_review,
          status: reviewee.status,
        })
        .eq("user_id", userId);

      throw new Error(
        rollbackRevieweeError
          ? `${updateAuthUserError.message}. Reviewee profile rollback failed: ${rollbackRevieweeError.message}`
          : updateAuthUserError.message,
      );
    }

    if (uploadedPaymentImagePath) {
      const newPaymentImagePath = uploadedPaymentImagePath;
      const oldPaymentImagePath = reviewee.payments?.image_path;
      let paymentUpdateErrorMessage = "";

      if (oldPaymentImagePath) {
        const { data: updatedPayments, error: updatePaymentError } =
          await supabaseAdmin
            .from("payments")
            .update({ image_path: newPaymentImagePath })
            .eq("user_id", userId)
            .eq("image_path", oldPaymentImagePath)
            .select("image_path");

        if (updatePaymentError) {
          paymentUpdateErrorMessage = updatePaymentError.message;
        } else if (updatedPayments.length !== 1) {
          paymentUpdateErrorMessage =
            "The proof of payment was changed by another request. Refresh and try again";
        }
      } else {
        const { error: insertPaymentError } = await supabaseAdmin
          .from("payments")
          .insert({
            user_id: userId,
            image_path: newPaymentImagePath,
          });

        if (insertPaymentError) {
          paymentUpdateErrorMessage = insertPaymentError.message;
        }
      }

      if (paymentUpdateErrorMessage) {
        const rollbackErrors: string[] = [];
        const { error: rollbackAuthUserError } =
          await supabaseAdmin.auth.admin.updateUserById(userId, {
            user_metadata: authUser.user_metadata,
          });

        if (rollbackAuthUserError) {
          rollbackErrors.push(
            `authentication profile: ${rollbackAuthUserError.message}`,
          );
        }

        const { error: rollbackRevieweeError } = await supabaseAdmin
          .from("users")
          .update({
            full_name: reviewee.full_name,
            mode_of_review: reviewee.mode_of_review,
            status: reviewee.status,
          })
          .eq("user_id", userId);

        if (rollbackRevieweeError) {
          rollbackErrors.push(
            `reviewee profile: ${rollbackRevieweeError.message}`,
          );
        }

        throw new Error(
          rollbackErrors.length > 0
            ? `${paymentUpdateErrorMessage}. Rollback also failed for ${rollbackErrors.join("; ")}`
            : paymentUpdateErrorMessage,
        );
      }

      if (oldPaymentImagePath && oldPaymentImagePath !== newPaymentImagePath) {
        const { error: removeOldPaymentImageError } = await supabaseAdmin.storage
          .from("payments")
          .remove([oldPaymentImagePath]);

        if (removeOldPaymentImageError) {
          const { data: restoredPayments, error: restorePaymentError } =
            await supabaseAdmin
              .from("payments")
              .update({ image_path: oldPaymentImagePath })
              .eq("user_id", userId)
              .eq("image_path", newPaymentImagePath)
              .select("image_path");

          if (restorePaymentError || restoredPayments.length !== 1) {
            uploadedPaymentImagePath = null;
            const restoreErrorMessage = restorePaymentError
              ? restorePaymentError.message
              : "the payment record changed again before it could be restored";

            throw new Error(
              `The proof of payment was updated, but the old image could not be deleted (${removeOldPaymentImageError.message}). Database restoration also failed because ${restoreErrorMessage}. The new image was preserved to avoid data loss`,
            );
          }

          const rollbackErrors: string[] = [];
          const { error: rollbackAuthUserError } =
            await supabaseAdmin.auth.admin.updateUserById(userId, {
              user_metadata: authUser.user_metadata,
            });

          if (rollbackAuthUserError) {
            rollbackErrors.push(
              `authentication profile: ${rollbackAuthUserError.message}`,
            );
          }

          const { error: rollbackRevieweeError } = await supabaseAdmin
            .from("users")
            .update({
              full_name: reviewee.full_name,
              mode_of_review: reviewee.mode_of_review,
              status: reviewee.status,
            })
            .eq("user_id", userId);

          if (rollbackRevieweeError) {
            rollbackErrors.push(
              `reviewee profile: ${rollbackRevieweeError.message}`,
            );
          }

          throw new Error(
            rollbackErrors.length > 0
              ? `The old proof of payment could not be deleted (${removeOldPaymentImageError.message}), so the payment replacement was rolled back. Profile rollback also failed for ${rollbackErrors.join("; ")}`
              : `The old proof of payment could not be deleted (${removeOldPaymentImageError.message}), so the update was rolled back`,
          );
        }
      }

      uploadedPaymentImagePath = null;
    }

    return { success: true, message: "Reviewee updated successfully" };
  } catch (error: unknown) {
    let errorMessage =
      error instanceof Error ? error.message : "Unable to update reviewee";

    if (uploadedPaymentImagePath) {
      const { error: cleanupPaymentImageError } = await supabaseAdmin.storage
        .from("payments")
        .remove([uploadedPaymentImagePath]);

      if (cleanupPaymentImageError) {
        console.error(cleanupPaymentImageError);
        errorMessage = `${errorMessage}. Uploaded image cleanup also failed: ${cleanupPaymentImageError.message}`;
      }
    }

    console.error(error);

    return {
      success: false,
      message: "Reviewee update failed",
      error: errorMessage,
    };
  }
};
