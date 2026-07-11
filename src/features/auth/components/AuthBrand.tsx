import Image from "next/image";
import logo from "@/public/logo-v2.png";

export default function AuthBrand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-12 items-center justify-center rounded-sm bg-teal-50 sm:size-13">
        <Image
          src={logo}
          alt="ABE Review App logo"
          className="size-9 object-contain sm:size-10"
          priority
        />
      </div>
      <span className="text-lg font-semibold text-black sm:text-xl">
        ABE Review App
      </span>
    </div>
  );
}
