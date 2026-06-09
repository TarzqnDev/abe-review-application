"use client";

import { BookOpenIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import abeLogo from "@/public/abeLogo.png";
import Image from "next/image";

export default function AdminNavbar() {
  const pathname = usePathname();

  return (
    <nav className="h-full bg-white w-75 rounded-lg border border-gray-300 shadow-sm px-4">
      <div className="flex justify-center items-center">
        <Image src={abeLogo} alt="Logo" className="w-18.75 h-18.75" />
        <div className="flex-col leading-0">
          <h1 className="font-medium text-xl text-teal-600">ABE</h1>
          <span className="text-sm text-teal-600">Review Application</span>
        </div>
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
          href="/admin/subject"
          className={`py-3 px-4 rounded-md flex items-center cursor-pointer ${pathname.startsWith("/admin/subject") ? "bg-teal-800 text-white" : "hover:bg-stone-100"}`}
        >
          <BookOpenIcon className="h-6 w-6 mr-2" />
          Subjects
        </Link>
      </div>
    </nav>
  );
}
