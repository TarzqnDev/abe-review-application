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
          ? "border-teal-600 bg-teal-50/70"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-5">
        <div>
          <h3 className="text-base font-semibold text-slate-950">
            {isToday ? "Today’s Trivia" : "This Week Trivia"}
          </h3>
          <time
            dateTime={trivia.publishDate}
            className="mt-0.5 block text-sm text-slate-500"
          >
            {formatTriviaDate(trivia.publishDate)}
          </time>
        </div>

        <button
          type="button"
          onClick={() => onEdit(trivia)}
          className="inline-flex shrink-0 cursor-pointer items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-teal-700 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        >
          <PencilSquareIcon className="h-4 w-4" aria-hidden="true" />
          Edit Trivia
        </button>
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-950">
        {trivia.content}
      </p>
    </article>
  );
}
