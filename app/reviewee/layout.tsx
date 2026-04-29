import RevieweeNavbar from "@/components/RevieweeNavbar";

export default function RevieweeLayout({
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
