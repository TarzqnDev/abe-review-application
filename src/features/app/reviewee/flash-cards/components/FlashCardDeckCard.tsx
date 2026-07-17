import { RectangleStackIcon } from "@heroicons/react/24/outline";
import type { FlashCardDeck } from "@/features/app/reviewee/flash-cards/types/flashCard";

type FlashCardDeckCardProps = {
  flashCardDeck: FlashCardDeck;
  onViewCards: (areaId: number) => void;
};

export default function FlashCardDeckCard({
  flashCardDeck,
  onViewCards,
}: FlashCardDeckCardProps) {
  const progressPercentage = Math.min(
    100,
    Math.round(
      (flashCardDeck.cardCount / Math.max(flashCardDeck.maxCards, 1)) * 100,
    ),
  );

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-base font-semibold text-slate-950">
        {flashCardDeck.areaName}
      </h2>

      <div className="mt-5 flex items-center justify-between gap-4 text-sm text-slate-500">
        <p className="inline-flex min-w-0 items-center gap-1.5">
          <RectangleStackIcon className="h-5 w-5 shrink-0 text-slate-400" />
          <span>
            {flashCardDeck.cardCount}/{flashCardDeck.maxCards} Flash Cards
          </span>
        </p>
        <span className="shrink-0 text-xs font-medium">
          {progressPercentage}%
        </span>
      </div>

      <div
        className="mt-2 h-px overflow-hidden bg-slate-200"
        role="progressbar"
        aria-label={`${flashCardDeck.areaName} flash card progress`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressPercentage}
      >
        <div
          className="h-full bg-teal-600"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5">
        <button
          type="button"
          className="inline-flex h-10 cursor-pointer items-center justify-center rounded bg-teal-600 px-4 text-sm font-medium text-white transition-colors hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
        >
          Play Now
        </button>
        <button
          type="button"
          onClick={() => onViewCards(flashCardDeck.areaId)}
          className="inline-flex h-10 cursor-pointer items-center justify-center rounded border border-teal-600 bg-white px-4 text-sm font-medium text-teal-600 transition-colors hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
        >
          View Cards
        </button>
      </div>
    </article>
  );
}
