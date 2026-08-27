"use client";

import type { AppRole } from "@/features/app/layout/types/appRole";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useNavbar = (role: AppRole | null) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [openAccountMenu, setOpenAccountMenu] = useState(false);
  const email = user?.email ?? "";
  const roleLabel = role === "admin" ? "Administrator" : role === "reviewee" ? "Reviewee" : "User";

  const handleToggleAccountMenu = () => {
    setOpenAccountMenu((isOpen) => !isOpen);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      queryClient.clear();
      router.replace("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return {
    email,
    handleLogout,
    handleToggleAccountMenu,
    openAccountMenu,
    roleLabel,
  };
};
