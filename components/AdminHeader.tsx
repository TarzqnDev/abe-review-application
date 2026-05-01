import { useAdminDashboard } from "@/features/admin/dashboard/hooks/useAdminDashboard";
import { Cog6ToothIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function AdminHeader() {
  const { handleLogout } = useAdminDashboard();

  const [openAccountMenu, setOpenAccountMenu] = useState(false);
  const pathname = usePathname();

  const pageMap: Record<string, string> = {
    "/admin/dashboard": "Dashboard",
    "/admin/mcqcontent": "MCQ Content",
  };

  const pageName = pageMap[pathname] || "Dashboard";

  return (
    <div className="mt-4 flex justify-between items-center mb-10">
      <div>
        <p>
          <span className="text-stone-600">Pages</span> / {pageName}
        </p>
      </div>

      <div className="flex gap-6 relative">
        <button className="cursor-pointer">
          <Cog6ToothIcon className="h-6 w-6 text-stone-600" />
        </button>
        <button
          className="cursor-pointer"
          onClick={() => setOpenAccountMenu(!openAccountMenu)}
        >
          <UserCircleIcon className="h-6 w-6 text-stone-600" />
        </button>

        {openAccountMenu && (
          <div className="absolute right-0 mt-8 w-48 bg-white border border-gray-300 rounded-md shadow-sm">
            <ul className="py-2">
              <li className="px-4 py-2 hover:bg-stone-100 cursor-pointer">
                Profile
              </li>
              <li
                onClick={handleLogout}
                className="px-4 py-2 hover:bg-stone-100 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
