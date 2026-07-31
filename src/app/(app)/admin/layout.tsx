import { getTokenRoles } from "@/lib/auth/get-token-roles";
import { createSupabaseServerComponentClient } from "@/lib/supabase/server-component";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerComponentClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const roles = getTokenRoles(session);

  if (!roles.includes("admin")) redirect("/unauthorized");

  return children;
}
