import Image from "next/image";
import authBackground from "@/public/authBackground.jpg";
import AuthBrand from "@/features/auth/components/AuthBrand";

export default function MobileLoginHero() {
  return (
    <section className="relative min-h-[11rem] w-full flex-1 overflow-hidden sm:min-h-[12rem] lg:hidden">
      <Image
        src={authBackground}
        alt="An open book"
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-surface/25" />
      <div className="absolute left-6 top-8 sm:left-10 sm:top-10">
        <AuthBrand />
      </div>
    </section>
  );
}
