import { useAdminDashboard } from "@/features/admin/dashboard/hooks/useAdminDashboard";
import { Cog6ToothIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function AdminHeader() {
  const { handleLogout } = useAdminDashboard();

  const [openAccountMenu, setOpenAccountMenu] = useState(false);

  return (
    <div className="mt-4 flex justify-between items-center mb-10">
      <div>
        <p>
          <span className="text-stone-600">Pages</span> / Dashboard
        </p>
      </div>

      <div className="flex gap-6 relative">
        <Cog6ToothIcon className="h-6 w-6 text-stone-600" />
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
              <li className="px-4 py-2 hover:bg-stone-100 cursor-pointer">
                <button className="w-full text-start" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
