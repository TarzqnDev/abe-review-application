import React, { useEffect, useEffectEvent, useState } from "react";
import { completeSignup } from "../actions/complete-signup.action";
import { handleFormChange } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/providers/AuthProvider";
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

  const handleUserInput = handleFormChange(formData, setFormData);

  const handleSignup = async (e: React.ChangeEvent<HTMLFormElement>) => {
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

    const formDataSubmission = new FormData(e.target);

    const { success, error: signupError } =
      await completeSignup(formDataSubmission);

    if (!success) {
      setError(signupError);
      return;
    }

    getUser();

    router.push("/reviewee/dashboard");
  };

  return {
    error,
    formData,
    handleSignup,
    handleUserInput,
    hasInviteSession,
  };
};
