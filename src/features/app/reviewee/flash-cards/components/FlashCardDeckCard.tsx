import {
  PencilSquareIcon,
  PlayIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/outline";
import type { FlashCardDeck } from "@/features/app/reviewee/flash-cards/types/flashCard";

type FlashCardDeckCardProps = {
  flashCardDeck: FlashCardDeck;
  onEdit: (flashCardDeck: FlashCardDeck) => void;
};

export default function FlashCardDeckCard({
  flashCardDeck,
  onEdit,
}: FlashCardDeckCardProps) {
  const firstQuestion = flashCardDeck.questions[0];

  return (
    <article className="flex min-h-[280px] flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
          {flashCardDeck.area}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <RectangleStackIcon className="h-4 w-4" />
          {flashCardDeck.questions.length}{" "}
          {flashCardDeck.questions.length === 1 ? "card" : "cards"}
        </span>
      </div>

      <h2 className="mt-5 text-lg font-semibold text-slate-900">
        {flashCardDeck.title}
      </h2>
      <div className="mt-4 rounded-md bg-slate-50 p-4">
        <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
          First question
        </p>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
          {firstQuestion.question}
        </p>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Updated {flashCardDeck.updatedAt}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3 pt-6">
        <button
          type="button"
          className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded bg-teal-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
        >
          <PlayIcon className="h-4 w-4" />
          Play Now
        </button>
        <button
          type="button"
          onClick={() => onEdit(flashCardDeck)}
          className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition-colors hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
        >
          <PencilSquareIcon className="h-4 w-4" />
          Edit
        </button>
      </div>
    </article>
  );
}
