import { getAuthRouteIdentity } from "@/lib/auth/route-identity";
import { createSupabaseServerComponentClient } from "@/lib/supabase/server-component";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerComponentClient();
  const identity = await getAuthRouteIdentity(supabase);

  if (!identity.isAuthenticated) redirect("/login");

  if (!identity.roles.includes("admin")) redirect("/unauthorized");

  return children;
}
