import { requestPasswordReset } from "@/features/auth/forgot-password/actions/request-password-reset.action";
import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_COOLDOWN_SECONDS = 5 * 60;
const RESEND_COOLDOWN_MILLISECONDS = RESEND_COOLDOWN_SECONDS * 1000;

const getRemainingCooldownSeconds = (deadline: number) =>
  Math.max(0, Math.ceil((deadline - Date.now()) / 1000));

export const useForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [error, setError] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldownSeconds, setResendCooldownSeconds] = useState(0);
  const [resendSuccessMessage, setResendSuccessMessage] = useState("");
  const resendCooldownDeadlineRef = useRef(0);

  useEffect(() => {
    if (resendCooldownSeconds <= 0) return;

    const updateCooldown = () => {
      setResendCooldownSeconds(
        getRemainingCooldownSeconds(resendCooldownDeadlineRef.current),
      );
    };
    const timeout = setTimeout(updateCooldown, 1000);

    window.addEventListener("focus", updateCooldown);
    document.addEventListener("visibilitychange", updateCooldown);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("focus", updateCooldown);
      document.removeEventListener("visibilitychange", updateCooldown);
    };
  }, [resendCooldownSeconds]);

  useEffect(() => {
    if (!resendSuccessMessage) return;

    const timeout = setTimeout(() => {
      setResendSuccessMessage("");
    }, 4000);

    return () => clearTimeout(timeout);
  }, [resendSuccessMessage]);

  const sendResetEmail = useCallback(
    async (emailAddress: string, isResend = false) => {
      const normalizedEmail = emailAddress.trim().toLowerCase();

      setError("");
      setResendSuccessMessage("");

      if (!normalizedEmail) {
        setError("Email is required");
        return;
      }

      if (!EMAIL_PATTERN.test(normalizedEmail)) {
        setError("Please enter a valid email address");
        return;
      }

      try {
        setIsSubmitting(true);

        const formData = new FormData();
        formData.set("email", normalizedEmail);

        const result = await requestPasswordReset(formData);

        if (!result.success) {
          setError(
            result.error ??
              "Unable to send the reset email right now. Please try again.",
          );
          return;
        }

        setEmail(normalizedEmail);
        setSubmittedEmail(normalizedEmail);
        setIsEmailSent(true);
        resendCooldownDeadlineRef.current =
          Date.now() + RESEND_COOLDOWN_MILLISECONDS;
        setResendCooldownSeconds(RESEND_COOLDOWN_SECONDS);

        if (isResend) {
          setResendSuccessMessage("A new reset link was sent.");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);

    if (error) setError("");
  };

  const handleSubmission = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendResetEmail(email);
  };

  const handleResend = async () => {
    const remainingCooldownSeconds = getRemainingCooldownSeconds(
      resendCooldownDeadlineRef.current,
    );

    if (remainingCooldownSeconds > 0) {
      setResendCooldownSeconds(remainingCooldownSeconds);
      return;
    }

    await sendResetEmail(submittedEmail, true);
  };

  const handleUseDifferentEmail = () => {
    setIsEmailSent(false);
    setError("");
    resendCooldownDeadlineRef.current = 0;
    setResendCooldownSeconds(0);
    setResendSuccessMessage("");
  };

  return {
    email,
    error,
    handleEmailChange,
    handleResend,
    handleSubmission,
    handleUseDifferentEmail,
    isEmailSent,
    isSubmitting,
    resendCooldownSeconds,
    resendSuccessMessage,
    submittedEmail,
  };
};
