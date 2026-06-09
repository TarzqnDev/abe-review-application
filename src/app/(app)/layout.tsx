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

  return children;
}
