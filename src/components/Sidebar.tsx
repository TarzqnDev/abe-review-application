"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import type { AppRole } from "@/features/app/layout/types/appRole";
import BookShelfIconImage from "@/public/book-shelf.png";
import FlashCardsIconImage from "@/public/flash-cards-icon.png";
import HistoryIconImage from "@/public/history-icon.png";
import McqQuizIconImage from "@/public/mcq-quiz-icon.png";
import TriviaIconImage from "@/public/trivia.png";
import UsersIconImage from "@/public/users.png";

type SidebarProps = {
  role: AppRole | null;
};

type SidebarLink = {
  href: string;
  icon: StaticImageData;
  iconAlt: string;
  label: string;
  matchPath: (pathname: string) => boolean;
};

const adminLinks: SidebarLink[] = [
  {
    href: "/admin/question-bank",
    icon: BookShelfIconImage,
    iconAlt: "Book shelf icon",
    label: "Question Bank",
    matchPath: (pathname) => pathname.startsWith("/admin/question-bank"),
  },
  {
    href: "/admin/manage-reviewees",
    icon: UsersIconImage,
    iconAlt: "Users icon",
    label: "Manage Reviewees",
    matchPath: (pathname) => pathname === "/admin/manage-reviewees",
  },
  {
    href: "/admin/trivias",
    icon: TriviaIconImage,
    iconAlt: "Trivia icon",
    label: "ABE Trivia",
    matchPath: (pathname) => pathname === "/admin/trivias",
  },
];

const revieweeLinks: SidebarLink[] = [
  {
    href: "/reviewee/mcq-quiz",
    icon: McqQuizIconImage,
    iconAlt: "MCQ quiz icon",
    label: "MCQ Quiz",
    matchPath: (pathname) => pathname === "/reviewee/mcq-quiz",
  },
  {
    href: "/reviewee/flash-cards",
    icon: FlashCardsIconImage,
    iconAlt: "Flash cards icon",
    label: "Flash Cards",
    matchPath: (pathname) => pathname.startsWith("/reviewee/flash-cards"),
  },
  {
    href: "/reviewee/history",
    icon: HistoryIconImage,
    iconAlt: "History icon",
    label: "History",
    matchPath: (pathname) => pathname.startsWith("/reviewee/history"),
  },
];

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const links =
    role === "admin" ? adminLinks : role === "reviewee" ? revieweeLinks : [];

  return (
    <nav className="sticky top-0 h-fit rounded-md border border-border bg-surface p-4 mt-10">
      <div className="flex flex-col gap-1">
        {links.map((link) => {
          const isActive = link.matchPath(pathname);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 rounded px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-teal-50 text-primary-accent"
                  : "text-secondary-text hover:bg-secondary-bg"
              }`}
            >
              <Image
                src={link.icon}
                alt={link.iconAlt}
                width={22}
                height={22}
                className="object-contain"
              />
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
