import React, { useState } from "react";
import { loginUser } from "../actions/login.action";
import { handleFormChange } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { getTokenRoles } from "@/lib/auth/get-token-roles";
import { supabase } from "@/lib/supabase/client";
import {
  AUTH_NOTICES,
  AUTH_NOTICE_QUERY_PARAMETER,
} from "@/features/app/layout/constants/authNotices";

export const useLogin = () => {
  const { getUser } = useAuth();

  const [formData, setFormData] = useState<{ email: string; password: string }>(
    {
      email: "",
      password: "",
    },
  );
  const [isLoggingin, setIsLoggingIn] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const validateUserInput = (email: string, password: string) => {
    if (!email) return "Email is required";
    if (!password) return "Password is required";
    return null;
  };

  const handleUserInput = handleFormChange(formData, setFormData);

  const handlePasswordVisibility = () => {
    setShowPassword((isPasswordVisible) => !isPasswordVisible);
  };

  const handleLogin = async (e: React.ChangeEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      setIsLoggingIn(true);

      const error = validateUserInput(formData.email, formData.password);
      if (error) {
        setError(error);
        return;
      }

      const formDataSubmission = new FormData(e.target);

      const { success, error: loginError } =
        await loginUser(formDataSubmission);

      if (!success) {
        setError(loginError);
        return;
      }

      getUser();

      const {
        data: { session },
      } = await supabase.auth.getSession();
      const roles = getTokenRoles(session);

      if (roles.includes("admin")) {
        router.push(
          `/admin?${AUTH_NOTICE_QUERY_PARAMETER}=${AUTH_NOTICES.loginSuccess}`,
        );
      } else if (roles.includes("reviewee")) {
        router.push(
          `/reviewee?${AUTH_NOTICE_QUERY_PARAMETER}=${AUTH_NOTICES.loginSuccess}`,
        );
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return {
    error,
    formData,
    handleLogin,
    handlePasswordVisibility,
    handleUserInput,
    isLoggingin,
    showPassword,
  };
};
