"use client";

import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useAdminHeader = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [openAccountMenu, setOpenAccountMenu] = useState(false);
  const email = user?.email ?? "antealvin@gmail.com";

  const handleToggleAccountMenu = () => {
    setOpenAccountMenu((isOpen) => !isOpen);
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
    email,
    handleLogout,
    handleToggleAccountMenu,
    openAccountMenu,
  };
};
