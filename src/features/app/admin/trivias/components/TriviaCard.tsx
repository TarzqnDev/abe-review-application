import type { AdminTrivia } from "@/features/app/admin/trivias/types/adminTrivia";
import {
  formatTriviaDate,
  isTriviaToday,
} from "@/features/app/admin/trivias/utils/adminTriviaDates";
import {
  PencilIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

type TriviaCardProps = {
  date: string;
  onCreate: (publishDate: string) => void;
  onEdit: (trivia: AdminTrivia) => void;
  trivia: AdminTrivia | null;
};

export default function TriviaCard({
  date,
  onCreate,
  onEdit,
  trivia,
}: TriviaCardProps) {
  const formattedDate = formatTriviaDate(date);
  const isToday = isTriviaToday(date);

  return (
    <article
      className={`min-h-32 rounded-lg border px-5 py-5 transition-shadow hover:shadow-sm ${
        isToday
          ? "border-primary-accent bg-teal-50/70"
          : "border-border bg-surface"
      }`}
    >
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between sm:gap-5">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-primary-text">
            {isToday
              ? "Today’s Trivia"
              : trivia
                ? "Upcoming Trivia"
                : "No Trivia Scheduled"}
          </h3>
          <time
            dateTime={date}
            className="mt-0.5 block text-sm text-secondary-text"
          >
            {formattedDate}
          </time>
        </div>

        {trivia ? (
          <button
            type="button"
            onClick={() => onEdit(trivia)}
            aria-label={`Edit trivia for ${formattedDate}`}
            className="inline-flex shrink-0 cursor-pointer items-center gap-1 self-start text-sm font-medium text-secondary-text transition-colors hover:text-primary-dark focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent"
          >
            <PencilSquareIcon className="h-4 w-4" aria-hidden="true" />
            Edit Trivia
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onCreate(date)}
            aria-label={`Write trivia for ${formattedDate}`}
            className="inline-flex shrink-0 cursor-pointer items-center gap-1 self-start text-sm font-medium text-primary-accent transition-colors hover:text-primary-dark focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent"
          >
            <PencilIcon className="h-4 w-4" aria-hidden="true" />
            Write Trivia
          </button>
        )}
      </div>

      {trivia ? (
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-primary-text">
          {trivia.content}
        </p>
      ) : (
        <p className="mt-3 text-sm leading-6 text-secondary-text">
          Add a trivia for this date so reviewees have something new to
          discover.
        </p>
      )}
    </article>
  );
}
