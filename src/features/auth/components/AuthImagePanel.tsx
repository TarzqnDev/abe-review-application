import Image from "next/image";
import authBackground from "@/public/authBackground.jpg";

export default function AuthImagePanel() {
  return (
    <section className="relative hidden min-h-screen w-3/5 overflow-hidden rounded-tr-[7.5rem] lg:block">
      <Image
        src={authBackground}
        alt="An open book"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-linear-to-r from-teal-600 via-teal-200 to-white opacity-60" />
    </section>
  );
}
