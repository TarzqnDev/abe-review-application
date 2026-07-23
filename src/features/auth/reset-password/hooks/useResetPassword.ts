import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  getPasswordRecoveryStatus,
  initializePasswordRecovery,
  resetPassword,
} from "@/features/auth/reset-password/actions/reset-password.action";

type ResetPasswordStatus =
  | "loading"
  | "initialization-error"
  | "invalid"
  | "ready"
  | "success";

export const useResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState<ResetPasswordStatus>("loading");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const hasInitializedPasswordRecovery = useRef(false);
  const isInitializingPasswordRecovery = useRef(false);
  const recoveryAccessToken = useRef<string | null>(null);

  const clearRecoveryReferences = useCallback(() => {
    recoveryAccessToken.current = null;
  }, []);

  const markRecoveryAsInvalid = useCallback(() => {
    clearRecoveryReferences();
    setStatus("invalid");
  }, [clearRecoveryReferences]);

  const checkExistingPasswordRecovery = useCallback(async () => {
    const { isValid, retryable } = await getPasswordRecoveryStatus();

    if (isValid) {
      clearRecoveryReferences();
      setStatus("ready");
      return;
    }

    setStatus(retryable ? "initialization-error" : "invalid");
  }, [clearRecoveryReferences]);

  const initializeRecoveryIdentity = useCallback(async () => {
    const currentRecoveryAccessToken = recoveryAccessToken.current;

    if (!currentRecoveryAccessToken) {
      await checkExistingPasswordRecovery();
      return;
    }

    try {
      const { success, retryable } = await initializePasswordRecovery(
        currentRecoveryAccessToken,
      );

      if (!success) {
        if (retryable) {
          setStatus("initialization-error");
        } else {
          markRecoveryAsInvalid();
        }

        return;
      }

      clearRecoveryReferences();
      setStatus("ready");
    } catch (error: unknown) {
      console.error("Unable to initialize password recovery", error);
      setStatus("initialization-error");
    }
  }, [
    checkExistingPasswordRecovery,
    clearRecoveryReferences,
    markRecoveryAsInvalid,
  ]);

  const runPasswordRecoveryInitialization = useCallback(async () => {
    if (isInitializingPasswordRecovery.current) return;

    isInitializingPasswordRecovery.current = true;

    try {
      await initializeRecoveryIdentity();
    } finally {
      isInitializingPasswordRecovery.current = false;
    }
  }, [initializeRecoveryIdentity]);

  useEffect(() => {
    const initializeResetPasswordPage = async () => {
      if (hasInitializedPasswordRecovery.current) return;

      hasInitializedPasswordRecovery.current = true;

      const hadRecoveryFragment = window.location.hash.length > 1;
      const hashParameters = new URLSearchParams(
        window.location.hash.slice(1),
      );
      const accessToken = hashParameters.get("access_token");
      const recoveryType = hashParameters.get("type");
      const recoveryError =
        hashParameters.get("error") ??
        hashParameters.get("error_description");
      const nextUrl = new URL(window.location.href);

      nextUrl.hash = "";
      window.history.replaceState({}, "", nextUrl.toString());

      if (!hadRecoveryFragment) {
        await runPasswordRecoveryInitialization();
        return;
      }

      if (
        recoveryError ||
        recoveryType !== "recovery" ||
        !accessToken
      ) {
        markRecoveryAsInvalid();
        return;
      }

      recoveryAccessToken.current = accessToken;
      await runPasswordRecoveryInitialization();
    };

    initializeResetPasswordPage();
  }, [markRecoveryAsInvalid, runPasswordRecoveryInitialization]);

  const handleRetryInitialization = async () => {
    setStatus("loading");
    await runPasswordRecoveryInitialization();
  };

  const handleUserInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
    setError("");
  };

  const handlePasswordVisibility = () => {
    setShowPassword((isPasswordVisible) => !isPasswordVisible);
  };

  const handleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(
      (isConfirmPasswordVisible) => !isConfirmPasswordVisible,
    );
  };

  const validateUserInput = () => {
    if (!formData.password) return "Password is required";
    if (!formData.confirmPassword) return "Please confirm your password";
    if (formData.password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  };

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isResettingPassword) return;

    setError("");

    const validationError = validateUserInput();

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsResettingPassword(true);

    try {
      const result = await resetPassword(new FormData(event.currentTarget));

      if (!result.success) {
        setError(result.error ?? "Unable to reset your password");

        if (
          result.error === "Your password reset link is invalid or has expired"
        ) {
          setStatus("invalid");
        }

        return;
      }

      setFormData({ password: "", confirmPassword: "" });
      setSuccessMessage(result.message ?? "Your password has been reset");
      setStatus("success");
    } finally {
      setIsResettingPassword(false);
    }
  };

  return {
    error,
    formData,
    handleConfirmPasswordVisibility,
    handlePasswordVisibility,
    handleRetryInitialization,
    handleResetPassword,
    handleUserInput,
    isResettingPassword,
    showConfirmPassword,
    showPassword,
    status,
    successMessage,
  };
};
