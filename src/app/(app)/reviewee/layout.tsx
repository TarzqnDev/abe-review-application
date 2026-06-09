import RevieweeLayoutClient from "@/components/RevieweeLayoutClient";

export default async function RevieweeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RevieweeLayoutClient>{children}</RevieweeLayoutClient>;
}
