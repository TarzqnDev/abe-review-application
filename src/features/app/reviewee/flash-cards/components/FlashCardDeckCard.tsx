import { RectangleStackIcon } from "@heroicons/react/24/outline";
import { LoaderCircle } from "lucide-react";
import type { FlashCardDeck } from "@/features/app/reviewee/flash-cards/types/flashCard";

type FlashCardDeckCardProps = {
  flashCardDeck: FlashCardDeck;
  isPlayDisabled: boolean;
  isPlayLoading: boolean;
  onPlay: (areaId: number) => void;
  onViewCards: (areaId: number) => void;
};

export default function FlashCardDeckCard({
  flashCardDeck,
  isPlayDisabled,
  isPlayLoading,
  onPlay,
  onViewCards,
}: FlashCardDeckCardProps) {
  const progressPercentage = Math.min(
    100,
    Math.round(
      (flashCardDeck.cardCount / Math.max(flashCardDeck.maxCards, 1)) * 100,
    ),
  );

  return (
    <article className="rounded-lg border border-border bg-surface p-5">
      <h2 className="text-base font-semibold text-primary-text">
        {flashCardDeck.areaName}
      </h2>

      <div className="mt-5 flex items-center justify-between gap-4 text-sm text-secondary-text">
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
        className="mt-2 h-px overflow-hidden bg-border"
        role="progressbar"
        aria-label={`${flashCardDeck.areaName} flash card progress`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressPercentage}
      >
        <div
          className="h-full bg-primary-accent"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => onPlay(flashCardDeck.areaId)}
          disabled={isPlayDisabled}
          aria-busy={isPlayLoading}
          aria-label={
            isPlayLoading
              ? `Preparing ${flashCardDeck.areaName} flash card game`
              : undefined
          }
          className="inline-flex h-10 cursor-pointer items-center justify-center rounded bg-primary-accent px-4 text-sm font-medium text-surface transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPlayLoading ? (
            <LoaderCircle className="h-5 w-5 animate-spin" />
          ) : (
            "Play Now"
          )}
        </button>
        <button
          type="button"
          onClick={() => onViewCards(flashCardDeck.areaId)}
          className="inline-flex h-10 cursor-pointer items-center justify-center rounded border border-primary-accent bg-surface px-4 text-sm font-medium text-primary-accent transition-colors hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2"
        >
          View Cards
        </button>
      </div>
    </article>
  );
}
