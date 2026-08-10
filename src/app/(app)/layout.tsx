import AppLayoutClient from "@/components/AppLayoutClient";
import type { AppRole } from "@/features/app/layout/types/appRole";
import { getAuthRouteIdentity } from "@/lib/auth/route-identity";
import { createSupabaseServerComponentClient } from "@/lib/supabase/server-component";
import { redirect } from "next/navigation";
import React from "react";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerComponentClient();
  const identity = await getAuthRouteIdentity(supabase);

  if (!identity.isAuthenticated || !identity.userId) redirect("/login");

  const role: AppRole | null = identity.assignedRole;

  const { data: account, error: accountError } = await supabase
    .from("users")
    .select("status")
    .eq("user_id", identity.userId)
    .maybeSingle();

  if (accountError || !account) {
    throw new Error("Unable to verify your account status");
  }

  const isInactive = account.status.toLowerCase() !== "active";

  return (
    <AppLayoutClient initialIsInactive={isInactive} role={role}>
      {children}
    </AppLayoutClient>
  );
}
