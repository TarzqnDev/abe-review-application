import React, { useEffect, useState } from "react";
import {
  fetchUsers,
  type AdminDashboardUser,
} from "../actions/fetch-users.action";
import { inviteUser } from "../actions/invite-user.action";
import { supabase } from "@/lib/supabase/client";
import { handleFormChange } from "@/lib/utils";
import { useRouter } from "next/navigation";

export const useAdminDashboard = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    startDate: string;
    endDate: string;
  }>({
    fullName: "",
    email: "",
    startDate: "",
    endDate: "",
  });
  const [users, setUsers] = useState<AdminDashboardUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isRegisteringUser, setIsRegisteringUser] = useState(false);
  const [usersError, setUsersError] = useState<string>("");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string>("");

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0] ?? "";
  };

  const formatDate = (date: string) => {
    const [dateOnly] = date.split("T");

    if (!dateOnly) return date;

    const [year, month, day] = dateOnly.split("-");

    if (!year || !month || !day) return date;

    return `${day}/${month}/${year}`;
  };

  const getStatusClassName = (status: string) => {
    if (status.toLowerCase() === "pending") {
      return "bg-yellow-500 text-white text-sm font-medium px-4 py-1 rounded-full";
    }

    if (status.toLowerCase() === "active") {
      return "bg-teal-800 text-white text-sm font-medium px-4 py-1 rounded-full";
    }

    return "bg-stone-500 text-white text-sm font-medium px-4 py-1 rounded-full";
  };

  const validateUserInput = (
    fullName: string,
    email: string,
    startDate: string,
    endDate: string,
  ) => {
    if (!fullName) return "Full name is required";
    if (!email) return "Email is required";
    if (!startDate) return "Start date is required";
    if (!endDate) return "End date is required";
    if (endDate <= startDate) return "End date must be after start date";
    return null;
  };

  const handleUserInput = handleFormChange(formData, setFormData);

  const handleOpenRegisterModal = () => {
    setFormData({
      fullName: "",
      email: "",
      startDate: getTodayDate(),
      endDate: "",
    });
    setError("");
    setSuccess("");
  };

  const handleCloseRegisterModal = () => {
    setTimeout(() => {
      setFormData({
        fullName: "",
        email: "",
        startDate: "",
        endDate: "",
      });
      setError("");
      setSuccess("");
    }, 300);
  };

  const loadUsers = async () => {
    const { success, users, error } = await fetchUsers();

    if (!success) {
      setUsers([]);
      setUsersError(error ?? "Unable to fetch users");
    } else {
      setUsers(users);
      setUsersError("");
    }

    setIsLoadingUsers(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRegisterUser = async (e: React.ChangeEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      setError("");
      setSuccess("");

      setIsRegisteringUser(true);

      const error = validateUserInput(
        formData.fullName,
        formData.email,
        formData.startDate,
        formData.endDate,
      );
      if (error) {
        setError(error);
        return {
          success: false,
          message: "",
        };
      }

      const formDataSubmission = new FormData(e.target);

      const { success, error: inviteUserError } =
        await inviteUser(formDataSubmission);

      if (!success) {
        setError(inviteUserError);
        return {
          success: false,
          message: "",
        };
      }

      setSuccess("Invite sent successfully");
      setFormData({
        fullName: "",
        email: "",
        startDate: "",
        endDate: "",
      });

      setIsLoadingUsers(true);
      await loadUsers();

      return {
        success: true,
        message: "Invite sent successfully",
      };
    } finally {
      setIsRegisteringUser(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.replace("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return {
    error,
    formData,
    handleCloseRegisterModal,
    handleLogout,
    handleOpenRegisterModal,
    handleRegisterUser,
    handleUserInput,
    isLoadingUsers,
    isRegisteringUser,
    success,
    users,
    usersError,
    formatDate,
    getStatusClassName,
  };
};
