import { getRedirectPathWithSearchParams } from "@/features/app/layout/utils/getRedirectPathWithSearchParams";
import { redirect } from "next/navigation";

type AdminPageProps = {
  searchParams: Promise<
    Record<string, string | string[] | undefined>
  >;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  return redirect(
    getRedirectPathWithSearchParams(
      "/admin/question-bank",
      await searchParams,
    ),
  );
}
