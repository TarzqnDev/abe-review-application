import RevieweeNavbar from "@/components/RevieweeNavbar";

export default function RevieweeLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RevieweeNavbar />
      <main>{children}</main>
    </>
  );
}
