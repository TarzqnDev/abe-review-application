import Image from "next/image";
import abequipLogo from "@/public/abequip-logo.png";
import brandIcon from "@/public/logo-v2.png";

export default function AuthBrand() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex size-12 items-center justify-center rounded-sm bg-teal-50 sm:size-13">
        <Image
          src={brandIcon}
          alt=""
          className="size-9 object-contain sm:size-10"
          priority
        />
      </div>
      <Image
        src={abequipLogo}
        alt="ABEquip"
        className="h-auto w-[105px] object-contain sm:w-[110px]"
        priority
      />
    </div>
  );
}
