import AppLayoutClient from "@/components/AppLayoutClient";
import type { AppRole } from "@/features/app/layout/types/appRole";
import { getTokenRoles } from "@/lib/auth/get-token-roles";
import { createSupabaseServerComponentClient } from "@/lib/supabase/server-component";
import { redirect } from "next/navigation";
import React from "react";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerComponentClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const roles = getTokenRoles(session);
  const role: AppRole | null = roles.includes("admin")
    ? "admin"
    : roles.includes("reviewee")
      ? "reviewee"
      : null;

  return <AppLayoutClient role={role}>{children}</AppLayoutClient>;
}
