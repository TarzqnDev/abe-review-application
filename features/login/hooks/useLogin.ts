import React, { useState } from "react";
import { loginUser } from "../actions/login.action";
import { handleFormChange } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/providers/AuthProvider";

export const useLogin = () => {
  const { getUser } = useAuth();

  const [formData, setFormData] = useState<{ email: string; password: string }>(
    {
      email: "",
      password: "",
    },
  );
  const [error, setError] = useState<string>("");

  const router = useRouter();

  const validateUserInput = (email: string, password: string) => {
    if (!email) return "Email is required";
    if (!password) return "Password is required";
    return null;
  };

  const handleUserInput = handleFormChange(formData, setFormData);

  const handleLogin = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const error = validateUserInput(formData.email, formData.password);
    if (error) {
      setError(error);
      return;
    }

    const formDataSubmission = new FormData(e.target);

    const { success, error: loginError } = await loginUser(formDataSubmission);

    if (!success) {
      setError(loginError);
      return;
    }

    getUser();

    router.push("/admin/dashboard");
  };

  return { handleLogin, handleUserInput, formData, error };
};
