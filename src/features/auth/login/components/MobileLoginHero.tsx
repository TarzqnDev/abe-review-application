import Image from "next/image";
import authBackground from "@/public/authBackground.jpg";
import AuthBrand from "@/features/auth/components/AuthBrand";

export default function MobileLoginHero() {
  return (
    <section className="relative h-[clamp(15rem,32vh,21rem)] w-full shrink-0 overflow-hidden lg:hidden">
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
