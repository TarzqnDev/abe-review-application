import React, { useEffect, useEffectEvent, useRef, useState } from "react";
import { completeAccountSetup } from "@/features/auth/accept-invite/actions/complete-account-setup.action";
import { getAccountSetupStatus } from "@/features/auth/accept-invite/actions/get-account-setup-status.action";
import { handleFormChange } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase/client";
import { getTokenRoles } from "@/lib/auth/get-token-roles";

const ACCOUNT_SETUP_LINK_TYPES = new Set(["invite", "recovery"]);

export const useAcceptInvite = () => {
  const { getUser, user } = useAuth();

  const [formData, setFormData] = useState<{
    password: string;
    confirmPassword: string;
  }>({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | undefined>("");
  const [hasInviteSession, setHasInviteSession] = useState<boolean | null>(
    null,
  );
  const [isAccountSetupCompleted, setIsAccountSetupCompleted] = useState<
    boolean | null
  >(null);
  const [accountSetupStatusError, setAccountSetupStatusError] = useState("");
  const [isCompletingAccountSetup, setIsCompletingAccountSetup] =
    useState(false);
  const [showAccountSetupSuccessBanner, setShowAccountSetupSuccessBanner] =
    useState(false);
  const [
    accountSetupSuccessBannerMessage,
    setAccountSetupSuccessBannerMessage,
  ] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const hasInitializedInviteSession = useRef(false);

  const router = useRouter();

  const syncUser = useEffectEvent(async () => {
    await getUser();
  });

  const syncAccountSetupStatus = useEffectEvent(async () => {
    setIsAccountSetupCompleted(null);
    setAccountSetupStatusError("");

    const result = await getAccountSetupStatus();

    if (!result.success) {
      setAccountSetupStatusError(
        result.error ?? "Unable to check your account",
      );
      return;
    }

    setIsAccountSetupCompleted(result.isAccountSetupCompleted);
  });

  useEffect(() => {
    const syncInviteSession = async () => {
      if (hasInitializedInviteSession.current) return;

      hasInitializedInviteSession.current = true;

      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const linkType = hashParams.get("type");
      const hasLinkError = Boolean(
        hashParams.get("error") ||
          hashParams.get("error_code") ||
          hashParams.get("error_description"),
      );
      const hasSessionTokens = Boolean(accessToken || refreshToken);

      if (hasSessionTokens) {
        if (
          !accessToken ||
          !refreshToken ||
          !linkType ||
          !ACCOUNT_SETUP_LINK_TYPES.has(linkType) ||
          hasLinkError
        ) {
          setHasInviteSession(false);
          return;
        }

        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          setHasInviteSession(false);
          return;
        }

        await syncUser();
        setHasInviteSession(true);
        await syncAccountSetupStatus();

        const nextUrl = new URL(window.location.href);
        nextUrl.hash = "";

        window.history.replaceState({}, "", nextUrl.toString());
        return;
      }

      if (linkType && !hasLinkError) {
        setHasInviteSession(false);
        return;
      }

      if (hasLinkError) {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setHasInviteSession(Boolean(session));

        if (session) {
          await syncUser();
          await syncAccountSetupStatus();
        }

        return;
      }

      if (user) {
        setHasInviteSession(true);
        await syncAccountSetupStatus();
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      setHasInviteSession(Boolean(session));

      if (session) {
        await syncAccountSetupStatus();
      }
    };

    syncInviteSession();
  }, [user]);

  const validateUserInput = (password: string, confirmPassword: string) => {
    if (!password) return "Password is required";
    if (!confirmPassword) return "Please confirm your password";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
  };
  const handleUserInput = handleFormChange(formData, setFormData);

  const handlePasswordVisibility = () => {
    setShowPassword((isPasswordVisible) => !isPasswordVisible);
  };

  const handleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(
      (isConfirmPasswordVisible) => !isConfirmPasswordVisible,
    );
  };

  const handleCompleteAccountSetup = async (
    event: React.ChangeEvent<HTMLFormElement>,
  ) => {
    try {
      event.preventDefault();

      setError("");

      const validationError = validateUserInput(
        formData.password,
        formData.confirmPassword,
      );
      if (validationError) {
        setError(validationError);
        return;
      }

      setIsCompletingAccountSetup(true);

      const formDataSubmission = new FormData(event.target);

      const {
        success,
        error: accountSetupError,
        message,
      } = await completeAccountSetup(formDataSubmission);

      if (!success) {
        setError(accountSetupError);
        return;
      }

      hasInitializedInviteSession.current = false;

      getUser();

      setAccountSetupSuccessBannerMessage(message);
      setShowAccountSetupSuccessBanner(true);

      setTimeout(() => {
        setShowAccountSetupSuccessBanner(false);
      }, 4000);
    } finally {
      setIsCompletingAccountSetup(false);
    }
  };

  const handleGoToDashboard = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const roles = getTokenRoles(session);

    if (roles.includes("admin")) {
      router.push("/admin");
    } else {
      router.push("/reviewee");
    }
  };

  return {
    accountSetupStatusError,
    accountSetupSuccessBannerMessage,
    error,
    formData,
    handleCompleteAccountSetup,
    handleConfirmPasswordVisibility,
    handleGoToDashboard,
    handlePasswordVisibility,
    handleUserInput,
    hasInviteSession,
    isAccountSetupCompleted,
    isCompletingAccountSetup,
    showAccountSetupSuccessBanner,
    showConfirmPassword,
    showPassword,
  };
};
