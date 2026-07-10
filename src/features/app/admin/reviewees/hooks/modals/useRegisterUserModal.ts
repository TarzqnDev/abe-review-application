import { useEffect, useState } from "react";
import { inviteUser } from "@/features/app/admin/reviewees/actions/invite-user.action";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

type RegisterUserModalOptions = {
  isOpen: boolean;
  onClose: () => void;
  onRegistered: (message: string) => Promise<void>;
};

export const useRegisterUserModal = ({
  isOpen,
  onClose,
  onRegistered,
}: RegisterUserModalOptions) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [modeOfReview, setModeOfReview] = useState("online");
  const [paymentImage, setPaymentImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setModeOfReview("online");
    setPaymentImage(null);
    setError("");
    setIsDragging(false);
  };

  useEffect(() => {
    if (isOpen) return;
    const timeout = window.setTimeout(resetForm, 300);
    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

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
      setError(validationError);
      return;
    }
    setPaymentImage(file);
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!fullName.trim()) return setError("Full name is required.");
    if (!email.trim()) return setError("Email address is required.");
    if (!paymentImage) return setError("Proof of payment is required.");

    const imageError = validateImage(paymentImage);
    if (imageError) return setError(imageError);

    setIsSubmitting(true);
    const formData = new FormData();
    formData.set("fullName", fullName.trim());
    formData.set("email", email.trim());
    formData.set("modeOfReview", modeOfReview);
    formData.set("paymentImage", paymentImage);

    try {
      const result = await inviteUser(formData);
      if (!result.success) {
        setError(result.error ?? "Unable to register user.");
        return;
      }
      resetForm();
      await onRegistered(result.message ?? "Invite sent successfully.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    error,
    fullName,
    handleSubmit,
    isDragging,
    isSubmitting,
    modeOfReview,
    paymentImage,
    selectPaymentImage,
    setEmail,
    setFullName,
    setIsDragging,
    setModeOfReview,
  };
};
