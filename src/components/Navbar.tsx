"use client";

import { UserCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

import type { AppRole } from "@/features/app/layout/types/appRole";
import { useNavbar } from "@/features/app/navbar/hooks/useNavbar";
import LogoV2 from "@/public/logo-v2.png";

type NavbarProps = {
  role: AppRole | null;
};

export default function Navbar({ role }: NavbarProps) {
  const {
    email,
    handleLogout,
    handleToggleAccountMenu,
    openAccountMenu,
    roleLabel,
  } = useNavbar(role);

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-[100px] w-full max-w-[1200px] items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-[50px] w-[50px] items-center justify-center rounded bg-teal-50 text-teal-600">
            <Image
              src={LogoV2}
              alt="ABE Review logo"
              className="object-contain"
            />
          </div>
          <h1 className="text-xl font-semibold text-slate-950">
            ABE Review App
          </h1>
        </div>

        <div className="relative flex items-center gap-3">
          <button
            type="button"
            className="flex cursor-pointer items-center gap-3 text-right"
            onClick={handleToggleAccountMenu}
            aria-expanded={openAccountMenu}
            aria-controls="account-menu"
          >
            <span>
              <span className="block text-sm font-medium text-slate-950">
                {email}
              </span>
              <span className="flex items-center justify-end gap-1 text-xs text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-600"></span>
                {roleLabel}
              </span>
            </span>
            <UserCircleIcon className="h-7 w-7 text-slate-500" />
          </button>

          {openAccountMenu && (
            <div
              id="account-menu"
              className="absolute right-0 top-12 z-50 w-[180px] rounded-lg border border-slate-200 bg-white p-3.5 shadow-md"
            >
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-10 w-full cursor-pointer items-center justify-center rounded bg-[#008477] px-4 text-sm font-medium text-white transition-colors hover:bg-[#006f65] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008477]"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
