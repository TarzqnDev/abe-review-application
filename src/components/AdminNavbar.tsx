"use client";

import { BookOpenIcon, UsersIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNavbar() {
  const pathname = usePathname();

  return (
    <nav className="h-fit rounded-md border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-1">
        <Link
          href="/admin/question-bank"
          className={`flex items-center justify-center gap-2 rounded px-4 py-3 text-sm font-medium transition-colors ${
            pathname.startsWith("/admin/question-bank")
              ? "bg-teal-50 text-teal-600"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          <BookOpenIcon className="h-5 w-5" />
          Question Bank
        </Link>

        <Link
          href="/admin/reviewees"
          className={`flex items-center justify-center gap-2 rounded px-4 py-3 text-sm font-medium transition-colors ${
            pathname === "/admin/reviewees"
              ? "bg-teal-50 text-teal-600"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          <UsersIcon className="h-5 w-5" />
          Manage Reviewees
        </Link>
      </div>
    </nav>
  );
}
