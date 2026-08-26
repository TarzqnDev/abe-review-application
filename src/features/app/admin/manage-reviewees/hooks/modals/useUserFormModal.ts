import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { inviteUser } from "@/features/app/admin/manage-reviewees/actions/invite-user.action";
import { updateReviewee } from "@/features/app/admin/manage-reviewees/actions/update-reviewee.action";
import type { Reviewee } from "@/features/app/admin/manage-reviewees/types/reviewee";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

export type UserFormModalOptions = {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (message: string) => Promise<void>;
  reviewee: Reviewee | null;
};

export const useUserFormModal = ({
  isOpen,
  onClose,
  onSaved,
  reviewee,
}: UserFormModalOptions) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [modeOfReview, setModeOfReview] = useState("online");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [
    isDeactivationConfirmationOpen,
    setIsDeactivationConfirmationOpen,
  ] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const deactivationReturnFocusRef = useRef<HTMLElement | null>(null);
  const isSubmittingRef = useRef(false);
  const statusSwitchRef = useRef<HTMLButtonElement>(null);

  const isEditing = reviewee !== null;

  useBodyScrollLock(isOpen);

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setModeOfReview("online");
    setStatus("");
    setError("");
    setIsDeactivationConfirmationOpen(false);
  };

  useEffect(() => {
    if (!isOpen) {
      const timeout = window.setTimeout(resetForm, 300);
      return () => window.clearTimeout(timeout);
    }

    let isCurrentEffect = true;
    void Promise.resolve().then(() => {
      if (!isCurrentEffect) return;
      setFullName(reviewee?.full_name ?? "");
      setEmail(reviewee?.email ?? "");
      setModeOfReview(reviewee?.mode_of_review ?? "online");
      setStatus(reviewee?.status.toLowerCase() ?? "");
      setError("");
    });

    return () => {
      isCurrentEffect = false;
    };
  }, [isOpen, reviewee]);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocusedElement = document.activeElement as HTMLElement | null;
    const focusFrame = window.requestAnimationFrame(() => dialogRef.current?.focus());

    return () => {
      window.cancelAnimationFrame(focusFrame);
      previouslyFocusedElement?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        !isSubmittingRef.current &&
        !isDeactivationConfirmationOpen
      ) {
        onClose();
        return;
      }

      if (event.key !== "Tab" || isDeactivationConfirmationOpen) {
        return;
      }

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (!focusableElements?.length) return;

      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement =
        focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstFocusableElement) {
        event.preventDefault();
        lastFocusableElement.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === lastFocusableElement
      ) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDeactivationConfirmationOpen, isOpen, onClose]);

  const handleStatusToggle = useCallback(() => {
    const originalStatus = reviewee?.status.toLowerCase();

    if (status === "active" && originalStatus === "active") {
      deactivationReturnFocusRef.current = statusSwitchRef.current;
      setIsDeactivationConfirmationOpen(true);
      return;
    }

    setStatus(status === "active" ? "inactive" : "active");
  }, [reviewee, status]);

  const cancelDeactivation = useCallback(() => {
    setIsDeactivationConfirmationOpen(false);
  }, []);

  const confirmDeactivation = useCallback(() => {
    setStatus("inactive");
    setIsDeactivationConfirmationOpen(false);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!isEditing && !email.trim()) {
      setError("Email address is required.");
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    const formData = new FormData();
    formData.set("fullName", fullName.trim());
    formData.set("modeOfReview", modeOfReview);

    try {
      const result = isEditing
        ? await updateReviewee(
            (() => {
              formData.set("userId", reviewee.user_id);
              formData.set("status", status);
              return formData;
            })(),
          )
        : await inviteUser(
            (() => {
              formData.set("email", email.trim());
              return formData;
            })(),
          );

      if (!result.success) {
        setError(
          result.error ??
            (isEditing
              ? "Unable to update reviewee."
              : "Unable to register user."),
        );
        return;
      }

      resetForm();
      await onSaved(
        result.message ??
          (isEditing
            ? "Reviewee updated successfully."
            : "Invite sent successfully."),
      );
    } catch {
      setError(
        isEditing
          ? "Unable to update reviewee. Please try again."
          : "Unable to register user. Please try again.",
      );
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return {
    dialogRef,
    cancelDeactivation,
    deactivationReturnFocusRef,
    email,
    error,
    fullName,
    confirmDeactivation,
    handleSubmit,
    handleStatusToggle,
    isDeactivationConfirmationOpen,
    isEditing,
    isSubmitting,
    modeOfReview,
    setEmail,
    setFullName,
    setModeOfReview,
    setStatus,
    status,
    statusSwitchRef,
  };
};
