import { LoaderCircle } from "lucide-react";
import QuizModalShell from "@/features/app/reviewee/mcq-quiz/components/QuizModalShell";
import { useGameCountdownModal } from "@/features/app/reviewee/mcq-quiz/hooks/modals/useGameCountdownModal";
import type {
  PreparedQuizSession,
  QuizQuestionTiming,
} from "@/features/app/reviewee/mcq-quiz/types/quiz";

export type GameCountdownModalProps = {
  isOpen: boolean;
  onCancel: () => void;
  onStarted: (timing: QuizQuestionTiming) => void;
  preparedSession: PreparedQuizSession | null;
};

export default function GameCountdownModal(props: GameCountdownModalProps) {
  const {
    countdown,
    error,
    handleCancel,
    isCancelling,
    isStarting,
    modalAccessibility,
  } = useGameCountdownModal(props);
  const { dialogRef, isVisible } = modalAccessibility;

  if (!props.preparedSession) return null;

  return (
    <QuizModalShell
      className="max-w-[430px] px-6 py-10 text-center sm:px-10 sm:py-12"
      dialogRef={dialogRef}
      isOpen={props.isOpen}
      isVisible={isVisible}
      labelledBy="game-countdown-title"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-accent">
        Get ready
      </p>
      <h2
        id="game-countdown-title"
        className="mt-3 text-xl font-semibold text-primary-text"
      >
        {props.preparedSession.gameType}
      </h2>
      <p className="mt-1 text-sm text-secondary-text">
        {props.preparedSession.areaName} · {props.preparedSession.difficulty}
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
