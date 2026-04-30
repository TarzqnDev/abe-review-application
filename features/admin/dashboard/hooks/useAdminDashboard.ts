import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export const useAdminDashboard = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.replace("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return { handleLogout };
};
