import { getTokenRoles } from "@/lib/auth/get-token-roles";
import { createSupabaseServerComponentClient } from "@/lib/supabase/server-component";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createSupabaseServerComponentClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const roles = getTokenRoles(session);

  if (roles.includes("admin")) redirect("/admin");
  if (roles.includes("reviewee")) redirect("/reviewee");

  redirect("/unauthorized");
}
