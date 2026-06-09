import React, { useEffect, useEffectEvent, useState } from "react";
import { completeSignup } from "../actions/complete-signup.action";
import { handleFormChange } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase/client";

export const useSignup = () => {
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
  const [requestAccessFormData, setRequestAccessFormData] = useState<{
    email: string;
  }>({
    email: "",
  });
  const [requestAccessError, setRequestAccessError] = useState<
    string | undefined
  >("");
  const [isRequestAccessModalOpen, setIsRequestAccessModalOpen] =
    useState(false);
  const [isSubmittingRequestAccess, setIsSubmittingRequestAccess] =
    useState(false);
  const [showRequestAccessSuccessBanner, setShowRequestAccessSuccessBanner] =
    useState(false);
  const [
    requestAccessSuccessBannerMessage,
    setRequestAccessSuccessBannerMessage,
  ] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [showSignupSuccessBanner, setShowSignupSuccessBanner] = useState(false);
  const [signupSuccessBannerMessage, setSignupSuccessBannerMessage] =
    useState("");

  const router = useRouter();

  const syncUser = useEffectEvent(async () => {
    await getUser();
  });

  useEffect(() => {
    const syncInviteSession = async () => {
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (accessToken && refreshToken) {
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

        const nextUrl = new URL(window.location.href);
        nextUrl.hash = "";

        window.history.replaceState({}, "", nextUrl.toString());
        return;
      }

      if (user) {
        setHasInviteSession(true);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      setHasInviteSession(Boolean(session));
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
  const validateRequestAccessInput = (email: string) => {
    if (!email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address";
    }
    return null;
  };

  const handleUserInput = handleFormChange(formData, setFormData);
  const handleRequestAccessInput = handleFormChange(
    requestAccessFormData,
    setRequestAccessFormData,
  );

  const handleSignup = async (e: React.ChangeEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      setError("");

      const error = validateUserInput(
        formData.password,
        formData.confirmPassword,
      );
      if (error) {
        setError(error);
        return;
      }

      setIsSigningUp(true);

      const formDataSubmission = new FormData(e.target);

      const {
        success,
        error: signupError,
        message,
      } = await completeSignup(formDataSubmission);

      if (!success) {
        setError(signupError);
        return;
      }

      getUser();

      setSignupSuccessBannerMessage(message);
      setShowSignupSuccessBanner(true);

      await new Promise((resolve) => setTimeout(resolve, 2500));

      router.push("/reviewee/dashboard");
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleOpenRequestAccessModal = () => {
    setRequestAccessFormData({
      email: "",
    });
    setRequestAccessError("");
    setIsRequestAccessModalOpen(true);
  };

  const handleCloseRequestAccessModal = () => {
    setIsRequestAccessModalOpen(false);

    setTimeout(() => {
      setRequestAccessFormData({
        email: "",
      });
      setRequestAccessError("");
    }, 300);
  };

  const handleRequestAccessSubmission = async (
    e: React.ChangeEvent<HTMLFormElement>,
  ) => {
    try {
      e.preventDefault();

      setRequestAccessError("");

      const error = validateRequestAccessInput(requestAccessFormData.email);

      if (error) {
        setRequestAccessError(error);
        return;
      }

      setIsSubmittingRequestAccess(true);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      handleCloseRequestAccessModal();
      setRequestAccessSuccessBannerMessage(
        "Request submitted. Admin notifications will be implemented soon.",
      );
      setShowRequestAccessSuccessBanner(true);
    } finally {
      setIsSubmittingRequestAccess(false);
    }
  };

  useEffect(() => {
    if (!showRequestAccessSuccessBanner) return;

    const timeout = setTimeout(() => {
      setShowRequestAccessSuccessBanner(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [showRequestAccessSuccessBanner]);

  return {
    error,
    formData,
    handleSignup,
    handleCloseRequestAccessModal,
    handleOpenRequestAccessModal,
    handleRequestAccessSubmission,
    handleRequestAccessInput,
    handleUserInput,
    hasInviteSession,
    isRequestAccessModalOpen,
    isSubmittingRequestAccess,
    isSigningUp,
    requestAccessError,
    requestAccessFormData,
    requestAccessSuccessBannerMessage,
    showSignupSuccessBanner,
    showRequestAccessSuccessBanner,
    signupSuccessBannerMessage,
  };
};
