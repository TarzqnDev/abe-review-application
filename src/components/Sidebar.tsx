"use client";

import { usePathname } from "next/navigation";

import type { AppRole } from "@/features/app/layout/types/appRole";
import NavigationLinks from "@/features/app/navigation/components/NavigationLinks";
import { getNavigationLinks } from "@/features/app/navigation/config/navigationLinks";

type SidebarProps = {
  role: AppRole | null;
};

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const links = getNavigationLinks(role);

  return (
    <nav className="sticky top-0 mt-10 hidden h-fit rounded-md border border-border bg-surface p-4 md:block">
      <div className="flex flex-col gap-1">
        <NavigationLinks links={links} pathname={pathname} />
      </div>
    </nav>
  );
}
