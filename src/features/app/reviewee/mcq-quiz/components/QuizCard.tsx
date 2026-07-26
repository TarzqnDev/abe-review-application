import Image from "next/image";
import type { QuizGame } from "@/features/app/reviewee/mcq-quiz/constants/quizGames";

type QuizCardProps = {
  onStart: (quizGame: QuizGame) => void;
  quizGame: QuizGame;
};

export default function QuizCard({ onStart, quizGame }: QuizCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-border bg-surface">
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
        <h2 className="text-base font-medium text-primary-text">
          {quizGame.title}
        </h2>
        <p className="mt-0.5 min-h-10 text-sm leading-5 text-secondary-text">
          {quizGame.description}
        </p>
        <button
          type="button"
          onClick={() => onStart(quizGame)}
          className="mt-3 flex w-full items-center justify-center rounded bg-primary-accent px-4 py-2 text-base font-medium text-surface transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent cursor-pointer"
        >
          Start Game
        </button>
      </div>
    </article>
  );
}
