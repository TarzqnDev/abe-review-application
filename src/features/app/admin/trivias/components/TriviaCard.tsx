import type { AdminTrivia } from "@/features/app/admin/trivias/types/adminTrivia";
import {
  formatTriviaDate,
  isTriviaToday,
} from "@/features/app/admin/trivias/utils/adminTriviaDates";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

type TriviaCardProps = {
  onEdit: (trivia: AdminTrivia) => void;
  trivia: AdminTrivia;
};

export default function TriviaCard({ onEdit, trivia }: TriviaCardProps) {
  const isToday = isTriviaToday(trivia.publishDate);

  return (
    <article
      className={`rounded-lg border px-5 py-5 transition-shadow hover:shadow-sm ${
        isToday
          ? "border-primary-accent bg-teal-50/70"
          : "border-border bg-surface"
      }`}
    >
      <div className="flex items-start justify-between gap-5">
        <div>
          <h3 className="text-base font-semibold text-primary-text">
            {isToday ? "Today’s Trivia" : "This Week Trivia"}
          </h3>
          <time
            dateTime={trivia.publishDate}
            className="mt-0.5 block text-sm text-secondary-text"
          >
            {formatTriviaDate(trivia.publishDate)}
          </time>
        </div>

        <button
          type="button"
          onClick={() => onEdit(trivia)}
          className="inline-flex shrink-0 cursor-pointer items-center gap-1 text-sm font-medium text-secondary-text transition-colors hover:text-primary-dark focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent"
        >
          <PencilSquareIcon className="h-4 w-4" aria-hidden="true" />
          Edit Trivia
        </button>
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-primary-text">
        {trivia.content}
      </p>
    </article>
  );
}
