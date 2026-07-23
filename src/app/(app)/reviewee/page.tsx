import { getRedirectPathWithSearchParams } from "@/features/app/layout/utils/getRedirectPathWithSearchParams";
import { redirect } from "next/navigation";

type RevieweePageProps = {
  searchParams: Promise<
    Record<string, string | string[] | undefined>
  >;
};

export default async function RevieweePage({
  searchParams,
}: RevieweePageProps) {
  return redirect(
    getRedirectPathWithSearchParams(
      "/reviewee/mcq-quiz",
      await searchParams,
    ),
  );
}
