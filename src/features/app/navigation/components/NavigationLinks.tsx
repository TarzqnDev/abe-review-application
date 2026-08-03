import type { NavigationLink } from "@/features/app/navigation/types/navigationLink";
import Image from "next/image";
import Link from "next/link";

type NavigationLinksProps = {
  links: NavigationLink[];
  pathname: string;
  onNavigate?: () => void;
};

export default function NavigationLinks({
  links,
  pathname,
  onNavigate,
}: NavigationLinksProps) {
  return links.map((link) => {
    const isActive = link.matchPath(pathname);

    return (
      <Link
        key={link.href}
        href={link.href}
        onClick={onNavigate}
        aria-current={isActive ? "page" : undefined}
        className={`flex items-center gap-2 rounded px-4 py-3 text-sm font-medium transition-colors ${
          isActive
            ? "bg-teal-50 text-primary-accent"
            : "text-secondary-text hover:bg-secondary-bg"
        }`}
      >
        <Image
          src={link.icon}
          alt={link.iconAlt}
          width={22}
          height={22}
          className="object-contain"
        />
        {link.label}
      </Link>
    );
  });
}
