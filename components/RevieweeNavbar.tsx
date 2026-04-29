"use client";

import { UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RevieweeNavbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-md border-b border-gray-300">
      <div className="flex items-center justify-between mx-72 h-20">
        <div>
          <h1 className="font-medium text-xl">ABE Review App</h1>
        </div>

        <div className="flex gap-6">
          <Link
            href="/reviewee/dashboard"
            className={
              pathname === "/reviewee/dashboard"
                ? "text-teal-600"
                : "text-gray-700 hover:text-gray-900"
            }
          >
            Home
          </Link>
          <Link
            href="/reviewee/history"
            className={
              pathname === "/reviewee/history"
                ? "text-teal-600"
                : "text-gray-700 hover:text-gray-900"
            }
          >
            History
          </Link>
        </div>

        <div className="flex gap-2">
          <UserCircleIcon className="h-6 w-6 text-stone-600" />
          <p>mark@gmail.com</p>
        </div>
      </div>
    </nav>
  );
}
