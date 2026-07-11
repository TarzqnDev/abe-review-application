import { type ChangeEvent, useEffect, useState } from "react";
import { handleFormChange } from "@/lib/utils";

type UseRequestRegistrationModalProps = {
  onClose: () => void;
};

export const useRequestRegistrationModal = ({
  onClose,
}: UseRequestRegistrationModalProps) => {
  const [formData, setFormData] = useState({ email: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [successBannerMessage, setSuccessBannerMessage] = useState("");

  const handleInput = handleFormChange(formData, setFormData);

  const handleClose = () => {
    onClose();

    setTimeout(() => {
      setFormData({ email: "" });
      setError("");
    }, 300);
  };

  const handleSubmission = async (event: ChangeEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setError("");

      if (!formData.email) {
        setError("Email is required");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError("Please enter a valid email address");
        return;
      }

      setIsSubmitting(true);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      handleClose();
      setSuccessBannerMessage(
        "Request submitted. Admin notifications will be implemented soon.",
      );
      setShowSuccessBanner(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!showSuccessBanner) return;

    const timeout = setTimeout(() => {
      setShowSuccessBanner(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [showSuccessBanner]);

  return {
    error,
    formData,
    handleClose,
    handleInput,
    handleSubmission,
    isSubmitting,
    showSuccessBanner,
    successBannerMessage,
  };
};
