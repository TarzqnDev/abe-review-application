import GameSummaryHeader from "@/features/app/reviewee/components/GameSummaryHeader";
import QuizModalShell from "@/features/app/reviewee/mcq-quiz/components/QuizModalShell";
import { useGameSummaryModal } from "@/features/app/reviewee/mcq-quiz/hooks/modals/useGameSummaryModal";
import type { QuizSummary } from "@/features/app/reviewee/mcq-quiz/types/quiz";

export type GameSummaryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  summary: QuizSummary | null;
};

export default function GameSummaryModal(props: GameSummaryModalProps) {
  const {
    closeButtonRef,
    donutBackground,
    duration,
    modalAccessibility,
    performanceMessage,
    scorePercentage,
  } = useGameSummaryModal(props);
  const { dialogRef, isVisible } = modalAccessibility;

  if (!props.summary) return null;

  return (
    <QuizModalShell
      className="max-h-[calc(100vh-2rem)] max-w-[475px] overflow-y-auto"
      dialogRef={dialogRef}
      isOpen={props.isOpen}
      isVisible={isVisible}
      labelledBy="game-summary-title"
    >
      <GameSummaryHeader
        metadata={`${props.summary.areaName} • ${props.summary.gameType} • ${props.summary.difficulty}`}
        title={
          props.summary.endReason === "completed"
            ? "MCQ Quiz Complete!"
            : "MCQ Quiz Ended!"
        }
        titleId="game-summary-title"
      />

      <div className="px-6 py-9 sm:px-10 sm:pb-10 sm:pt-10">
        <p className="text-center text-base font-medium text-slate-950">
          Your score percentage was:
        </p>

        <div
          aria-label={`${scorePercentage}% correct. ${props.summary.correct} correct, ${props.summary.incorrect} wrong, ${props.summary.timedOut} timed out, and ${props.summary.notPlayed} not played.`}
          className="mx-auto mt-5 flex h-28 w-28 items-center justify-center rounded-full"
          role="img"
          style={{ background: donutBackground }}
        >
          <div className="flex h-[88px] w-[88px] flex-col items-center justify-center rounded-full bg-white">
            <span className="text-xl font-semibold leading-5 text-slate-950">
              {scorePercentage}%
            </span>
            <span className="text-xs text-slate-500">Correct</span>
          </div>
        </div>

        <p className="mt-3 text-center text-sm font-medium text-[#009d8f]">
          {performanceMessage}
        </p>

        <section className="mt-6" aria-labelledby="score-summary-heading">
          <h3
            id="score-summary-heading"
            className="text-sm font-medium text-slate-950"
          >
            Score Summary
          </h3>

          <dl className="mt-1 grid grid-cols-2 gap-2.5">
            <div className="flex min-h-[100px] flex-col items-center justify-center rounded border border-slate-200 bg-slate-50 px-2 text-center">
              <dt className="order-2 mt-1 text-[13px] text-slate-500">
                Questions Answered
              </dt>
              <dd className="order-1 text-xl font-semibold text-slate-500">
                {props.summary.answered}/{props.summary.totalQuestions}
              </dd>
            </div>
            <div className="flex min-h-[100px] flex-col items-center justify-center rounded border border-slate-200 bg-slate-50 px-2 text-center">
              <dt className="order-2 mt-1 text-[13px] text-slate-500">
                Game Duration
              </dt>
              <dd className="order-1 text-xl font-semibold text-slate-500">
                {duration}
              </dd>
            </div>
          </dl>

          <dl className="mt-2.5 grid grid-cols-3 gap-2.5">
            <div className="flex min-h-[75px] flex-col items-center justify-center rounded border border-[#009d8f] bg-teal-50 px-1 text-center">
              <dt className="order-2 mt-0.5 text-[13px] text-[#009d8f]">
                Correct
              </dt>
              <dd className="order-1 text-base font-medium text-[#009d8f]">
                {props.summary.correct}
              </dd>
            </div>
            <div className="flex min-h-[75px] flex-col items-center justify-center rounded border border-red-500 bg-red-50 px-1 text-center">
              <dt className="order-2 mt-0.5 text-[13px] text-red-500">Wrong</dt>
              <dd className="order-1 text-base font-medium text-red-500">
                {props.summary.incorrect}
              </dd>
            </div>
            <div className="flex min-h-[75px] flex-col items-center justify-center rounded border border-amber-500 bg-amber-50 px-1 text-center">
              <dt className="order-2 mt-0.5 text-[13px] text-amber-500">
                Timed Out
              </dt>
              <dd className="order-1 text-base font-medium text-amber-500">
                {props.summary.timedOut}
              </dd>
            </div>
          </dl>
        </section>

        <button
          ref={closeButtonRef}
          type="button"
          onClick={props.onClose}
          className="mt-5 h-[50px] w-full cursor-pointer rounded bg-[#009d8f] text-base font-medium text-white transition-colors hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
        >
          Back to MCQ Quiz
        </button>
      </div>
    </QuizModalShell>
  );
}
