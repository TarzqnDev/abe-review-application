"use client";

import { BookOpenIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNavbar() {
  const pathname = usePathname();

  return (
    <nav className="h-full bg-white w-75 rounded-lg border border-gray-300 shadow-sm px-4">
      <div className="flex justify-center">
        <h1 className="font-medium text-xl my-6">ABE Review App</h1>
      </div>

      <div className="mb-4 w-full h-px bg-[radial-gradient(circle_at_center,rgba(209,213,220,1),transparent)]"></div>

      <div className="flex flex-col gap-2">
        <Link
          href="/admin/dashboard"
          className={`py-3 px-4 rounded-md flex items-center cursor-pointer ${pathname === "/admin/dashboard" ? "bg-teal-800 text-white" : "hover:bg-stone-100"}`}
        >
          <Squares2X2Icon className="h-6 w-6 mr-2" />
          Dashboard
        </Link>
        <Link
          href="/admin/mcqcontent"
          className={`py-3 px-4 rounded-md flex items-center cursor-pointer ${pathname === "/admin/mcqcontent" ? "bg-teal-800 text-white" : "hover:bg-stone-100"}`}
        >
          <BookOpenIcon className="h-6 w-6 mr-2" />
          MCQ Content
        </Link>
      </div>
    </nav>
  );
}
