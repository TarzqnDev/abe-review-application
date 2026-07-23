import { LoaderCircle } from "lucide-react";
import { useFlashCardGameCountdownModal } from "@/features/app/reviewee/flash-cards/hooks/modals/game/useFlashCardGameCountdownModal";
import type {
  FlashCardTiming,
  PreparedFlashCardSession,
} from "@/features/app/reviewee/flash-cards/types/flashCardGame";
import QuizModalShell from "@/features/app/reviewee/mcq-quiz/components/QuizModalShell";

export type FlashCardGameCountdownModalProps = {
  isOpen: boolean;
  onCancel: () => void;
  onStarted: (timing: FlashCardTiming) => void;
  preparedSession: PreparedFlashCardSession | null;
};

export default function FlashCardGameCountdownModal(
  props: FlashCardGameCountdownModalProps,
) {
  const {
    countdown,
    error,
    handleCancel,
    isCancelling,
    isStarting,
    modalAccessibility,
  } = useFlashCardGameCountdownModal(props);
  const { dialogRef, isVisible } = modalAccessibility;

  if (!props.preparedSession) return null;

  return (
    <QuizModalShell
      className="max-w-[430px] px-6 py-10 text-center sm:px-10 sm:py-12"
      dialogRef={dialogRef}
      isOpen={props.isOpen}
      isVisible={isVisible}
      labelledBy="flash-card-game-countdown-title"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-accent">
        Get ready
      </p>
      <h2
        id="flash-card-game-countdown-title"
        className="mt-3 text-xl font-semibold text-primary-text"
      >
        Flash Cards
      </h2>
      <p className="mt-1 text-sm text-secondary-text">
        {props.preparedSession.areaName} ·{" "}
        {props.preparedSession.totalFlashCards} Flash Cards
      </p>

      <div
        className="my-8 text-8xl font-semibold tabular-nums text-primary-accent transition-opacity duration-300"
        aria-live="assertive"
        aria-atomic="true"
      >
        {countdown > 0 ? (
          countdown
        ) : isStarting ? (
          <LoaderCircle className="mx-auto h-14 w-14 animate-spin" />
        ) : (
          ""
        )}
      </div>

      {error && (
        <p role="alert" className="mb-5 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleCancel}
        disabled={isCancelling || isStarting}
        className="flex h-11 w-full cursor-pointer items-center justify-center rounded border border-primary-accent bg-surface text-sm font-semibold text-primary-accent transition-colors hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isCancelling || isStarting ? (
          <LoaderCircle className="h-5 w-5 animate-spin" />
        ) : (
          "Cancel"
        )}
      </button>
    </QuizModalShell>
  );
}
