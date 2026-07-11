"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BookShelfIconImage from "@/public/book-shelf.png";
import UsersIconImage from "@/public/users.png";
import TriviaIconImage from "@/public/trivia.png";
import Image from "next/image";

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="h-fit rounded-md border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-1">
        <Link
          href="/admin/question-bank"
          className={`flex items-center gap-2 rounded px-4 py-3 text-sm font-medium transition-colors ${
            pathname.startsWith("/admin/question-bank")
              ? "bg-teal-50 text-teal-600"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          <Image
            src={BookShelfIconImage}
            alt="Book shelf icon"
            width={22}
            height={22}
            className="object-contain"
          />
          Question Bank
        </Link>

        <Link
          href="/admin/reviewees"
          className={`flex items-center gap-2 rounded px-4 py-3 text-sm font-medium transition-colors ${
            pathname === "/admin/reviewees"
              ? "bg-teal-50 text-teal-600"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          <Image
            src={UsersIconImage}
            alt="Users icon"
            width={22}
            height={22}
            className="object-contain"
          />
          Manage Reviewees
        </Link>

        <Link
          href="/admin/trivias"
          className={`flex items-center gap-2 rounded px-4 py-3 text-sm font-medium transition-colors ${
            pathname === "/admin/trivias"
              ? "bg-teal-50 text-teal-600"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          <Image
            src={TriviaIconImage}
            alt="Users icon"
            width={22}
            height={22}
            className="object-contain"
          />
          ABE Trivia
        </Link>
      </div>
    </nav>
  );
}
