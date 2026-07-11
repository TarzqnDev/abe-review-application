import { useAdminNavbar } from "@/features/app/admin/navbar/hooks/useAdminNavbar";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import LogoV2 from "@/public/logo-v2.png";

export default function AdminNavbar() {
  const { email, handleLogout, handleToggleAccountMenu, openAccountMenu } =
    useAdminNavbar();

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
          >
            <span>
              <span className="block text-sm font-medium text-slate-950">
                {email}
              </span>
              <span className="flex items-center justify-end gap-1 text-xs text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-600"></span>
                Administrator
              </span>
            </span>
            <UserCircleIcon className="h-7 w-7 text-slate-500" />
          </button>

          {openAccountMenu && (
            <div className="absolute right-0 top-12 z-50 w-44 rounded-md border border-slate-200 bg-white shadow-sm">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full cursor-pointer px-4 py-3 text-left text-sm text-slate-600 hover:bg-slate-50"
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
