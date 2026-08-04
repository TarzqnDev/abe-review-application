import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { getPaymentProofUrl } from "@/features/app/admin/manage-reviewees/actions/get-payment-proof-url.action";
import { inviteUser } from "@/features/app/admin/manage-reviewees/actions/invite-user.action";
import { updateReviewee } from "@/features/app/admin/manage-reviewees/actions/update-reviewee.action";
import type { Reviewee } from "@/features/app/admin/manage-reviewees/types/reviewee";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

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
  const [paymentImage, setPaymentImage] = useState<File | null>(null);
  const [paymentImagePreviewUrl, setPaymentImagePreviewUrl] = useState("");
  const [paymentImageUrl, setPaymentImageUrl] = useState("");
  const [paymentImageError, setPaymentImageError] = useState("");
  const [isPaymentImageLoading, setIsPaymentImageLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaymentViewerOpen, setIsPaymentViewerOpen] = useState(false);
  const [
    isDeactivationConfirmationOpen,
    setIsDeactivationConfirmationOpen,
  ] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLInputElement>(null);
  const deactivationReturnFocusRef = useRef<HTMLElement | null>(null);
  const isSubmittingRef = useRef(false);
  const paymentImageInputRef = useRef<HTMLInputElement>(null);
  const paymentViewerReturnFocusRef = useRef<HTMLElement | null>(null);
  const statusSwitchRef = useRef<HTMLButtonElement>(null);
  const paymentImagePreviewUrlRef = useRef("");

  const isEditing = reviewee !== null;

  useBodyScrollLock(isOpen);

  const resetForm = () => {
    if (paymentImagePreviewUrlRef.current) {
      URL.revokeObjectURL(paymentImagePreviewUrlRef.current);
      paymentImagePreviewUrlRef.current = "";
    }

    setFullName("");
    setEmail("");
    setModeOfReview("online");
    setStatus("");
    setPaymentImage(null);
    setPaymentImagePreviewUrl("");
    setPaymentImageUrl("");
    setPaymentImageError("");
    setIsPaymentImageLoading(false);
    setError("");
    setIsDragging(false);
    setIsPaymentViewerOpen(false);
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
      if (paymentImagePreviewUrlRef.current) {
        URL.revokeObjectURL(paymentImagePreviewUrlRef.current);
        paymentImagePreviewUrlRef.current = "";
      }
      setFullName(reviewee?.full_name ?? "");
      setEmail(reviewee?.email ?? "");
      setModeOfReview(reviewee?.mode_of_review ?? "online");
      setStatus(reviewee?.status.toLowerCase() ?? "");
      setPaymentImage(null);
      setPaymentImagePreviewUrl("");
      setPaymentImageUrl("");
      setPaymentImageError("");
      setIsPaymentImageLoading(false);
      setError("");
      setIsPaymentViewerOpen(false);
    });

    return () => {
      isCurrentEffect = false;
    };
  }, [isOpen, reviewee]);

  useEffect(
    () => () => {
      if (paymentImagePreviewUrlRef.current) {
        URL.revokeObjectURL(paymentImagePreviewUrlRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!isOpen || !reviewee?.payment_image_path) return;

    let isCurrentRequest = true;
    void Promise.resolve().then(async () => {
      setIsPaymentImageLoading(true);
      setPaymentImageError("");
      const result = await getPaymentProofUrl(reviewee.payment_image_path!);

      if (!isCurrentRequest) return;
      if (result.success && result.signedUrl) {
        setPaymentImageUrl(result.signedUrl);
      } else {
        setPaymentImageError(
          result.error ?? "Unable to load proof of payment.",
        );
      }
      setIsPaymentImageLoading(false);
    });

    return () => {
      isCurrentRequest = false;
    };
  }, [isOpen, reviewee]);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocusedElement = document.activeElement as HTMLElement | null;
    const focusFrame = window.requestAnimationFrame(() =>
      initialFocusRef.current?.focus(),
    );

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
        !isDeactivationConfirmationOpen &&
        !isPaymentViewerOpen
      ) {
        onClose();
        return;
      }

      if (
        event.key !== "Tab" ||
        isDeactivationConfirmationOpen ||
        isPaymentViewerOpen
      ) {
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
  }, [isDeactivationConfirmationOpen, isOpen, isPaymentViewerOpen, onClose]);

  const openPaymentViewer = useCallback((trigger: HTMLElement) => {
    paymentViewerReturnFocusRef.current = trigger;
    setIsPaymentViewerOpen(true);
  }, []);

  const closePaymentViewer = useCallback(() => {
    setIsPaymentViewerOpen(false);
  }, []);

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

  const validateImage = (file: File) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return "Payment must be a PNG, JPEG, or WebP image.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "Payment image must be 5 MB or smaller.";
    }
    return "";
  };

  const selectPaymentImage = (file?: File) => {
    if (!file) return;
    const validationError = validateImage(file);
    if (validationError) {
      setPaymentImage(null);
      if (paymentImagePreviewUrlRef.current) {
        URL.revokeObjectURL(paymentImagePreviewUrlRef.current);
        paymentImagePreviewUrlRef.current = "";
      }
      setPaymentImagePreviewUrl("");
      setError(validationError);
      return;
    }

    if (paymentImagePreviewUrlRef.current) {
      URL.revokeObjectURL(paymentImagePreviewUrlRef.current);
    }
    const previewUrl = URL.createObjectURL(file);
    paymentImagePreviewUrlRef.current = previewUrl;
    setPaymentImage(file);
    setPaymentImagePreviewUrl(previewUrl);
    setPaymentImageError("");
    setError("");
  };

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

    if (!isEditing && !paymentImage) {
      setError("Proof of payment is required.");
      return;
    }

    if (paymentImage) {
      const imageError = validateImage(paymentImage);
      if (imageError) {
        setError(imageError);
        return;
      }
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
              if (paymentImage) {
                formData.set("paymentImage", paymentImage);
              }
              return formData;
            })(),
          )
        : await inviteUser(
            (() => {
              formData.set("email", email.trim());
              formData.set("paymentImage", paymentImage!);
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
    isDragging,
    isDeactivationConfirmationOpen,
    isEditing,
    isPaymentImageLoading,
    isPaymentViewerOpen,
    isSubmitting,
    initialFocusRef,
    modeOfReview,
    paymentImage,
    paymentImageError,
    paymentImageInputRef,
    paymentImagePreviewUrl,
    paymentImageUrl,
    paymentViewerReturnFocusRef,
    openPaymentViewer,
    closePaymentViewer,
    selectPaymentImage,
    setEmail,
    setFullName,
    setIsDragging,
    setModeOfReview,
    setStatus,
    status,
    statusSwitchRef,
  };
};
