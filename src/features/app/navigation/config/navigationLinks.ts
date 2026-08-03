import type { AppRole } from "@/features/app/layout/types/appRole";
import type { NavigationLink } from "@/features/app/navigation/types/navigationLink";
import BookShelfIconImage from "@/public/book-shelf.png";
import FlashCardsIconImage from "@/public/flash-cards-icon.png";
import HistoryIconImage from "@/public/history-icon.png";
import McqQuizIconImage from "@/public/mcq-quiz-icon.png";
import TriviaIconImage from "@/public/trivia.png";
import UsersIconImage from "@/public/users.png";

const adminLinks: NavigationLink[] = [
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

const revieweeLinks: NavigationLink[] = [
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

export const getNavigationLinks = (role: AppRole | null) =>
  role === "admin" ? adminLinks : role === "reviewee" ? revieweeLinks : [];
