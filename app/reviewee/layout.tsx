import RevieweeLayoutClient from "@/components/RevieweeLayoutClient";
import { createSupabaseServerComponentClient } from "@/lib/supabase/server-component";
import { redirect } from "next/navigation";

export default async function RevieweeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerComponentClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return <RevieweeLayoutClient>{children}</RevieweeLayoutClient>;
}
