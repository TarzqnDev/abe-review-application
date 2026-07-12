import Image from "next/image";
import Link from "next/link";
import type { QuizGame } from "@/features/app/reviewee/dashboard/constants/quizGames";

type QuizCardProps = {
  quizGame: QuizGame;
};

export default function QuizCard({ quizGame }: QuizCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="relative h-[150px] w-full overflow-hidden">
        <Image
          src={quizGame.image}
          alt={quizGame.imageAlt}
          fill
          sizes="(min-width: 1024px) 450px, 100vw"
          className="object-cover"
        />
      </div>

      <div className="p-5 pt-3">
        <h2 className="text-base font-medium text-slate-950">
          {quizGame.title}
        </h2>
        <p className="mt-0.5 min-h-10 text-sm leading-5 text-slate-500">
          {quizGame.description}
        </p>
        <Link
          href={quizGame.href}
          className="mt-3 flex w-full items-center justify-center rounded bg-teal-600 px-4 py-2 text-base font-medium text-white transition-colors hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        >
          Start Game
        </Link>
      </div>
    </article>
  );
}
