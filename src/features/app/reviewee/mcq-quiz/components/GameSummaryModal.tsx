import {
  CheckCircleIcon,
  ClockIcon,
  MinusCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import QuizModalShell from "@/features/app/reviewee/mcq-quiz/components/QuizModalShell";
import { useGameSummaryModal } from "@/features/app/reviewee/mcq-quiz/hooks/modals/useGameSummaryModal";
import type { QuizSummary } from "@/features/app/reviewee/mcq-quiz/types/quiz";

export type GameSummaryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  summary: QuizSummary | null;
};

const formatDuration = (durationSeconds: number) => {
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;

  if (minutes === 0) return `${seconds} seconds`;
  return `${minutes}m ${seconds}s`;
};

export default function GameSummaryModal(props: GameSummaryModalProps) {
  const { closeButtonRef, modalAccessibility } =
    useGameSummaryModal(props);
  const { dialogRef, isVisible } = modalAccessibility;

  if (!props.summary) return null;

  const isCompleted = props.summary.status === "completed";

  return (
    <QuizModalShell
      className="max-w-[580px] overflow-hidden"
      dialogRef={dialogRef}
      isOpen={props.isOpen}
      isVisible={isVisible}
      labelledBy="game-summary-title"
    >
      <div className="bg-teal-600 px-6 py-7 text-center text-white sm:px-9">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
          <CheckCircleIcon className="h-8 w-8" />
        </div>
        <h2
          id="game-summary-title"
          className="mt-3 text-2xl font-semibold"
        >
          {isCompleted ? "Game Complete!" : "Game Ended"}
        </h2>
        <p className="mt-1 text-sm text-teal-50">
          {props.summary.areaName} · {props.summary.gameType} ·{" "}
          {props.summary.difficulty}
        </p>
      </div>

      <div className="px-6 py-7 sm:px-9 sm:py-8">
        <div className="text-center">
          <p className="text-4xl font-semibold text-slate-900">
            {props.summary.accuracyPercentage}%
          </p>
          <p className="mt-1 text-sm text-slate-500">Answer accuracy</p>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded border border-teal-100 bg-teal-50 p-3 text-center">
            <CheckCircleIcon className="mx-auto h-5 w-5 text-teal-600" />
            <p className="mt-1 text-xl font-semibold text-teal-700">
              {props.summary.correct}
            </p>
            <p className="text-xs text-teal-700">Correct</p>
          </div>
          <div className="rounded border border-red-100 bg-red-50 p-3 text-center">
            <XCircleIcon className="mx-auto h-5 w-5 text-red-500" />
            <p className="mt-1 text-xl font-semibold text-red-600">
              {props.summary.incorrect}
            </p>
            <p className="text-xs text-red-600">Incorrect</p>
          </div>
          <div className="rounded border border-amber-100 bg-amber-50 p-3 text-center">
            <ClockIcon className="mx-auto h-5 w-5 text-amber-600" />
            <p className="mt-1 text-xl font-semibold text-amber-700">
              {props.summary.timedOut}
            </p>
            <p className="text-xs text-amber-700">Timed Out</p>
          </div>
          <div className="rounded border border-slate-200 bg-slate-50 p-3 text-center">
            <MinusCircleIcon className="mx-auto h-5 w-5 text-slate-500" />
            <p className="text-xl font-semibold text-slate-700">
              {props.summary.notPlayed}
            </p>
            <p className="text-xs text-slate-500">Not Played</p>
          </div>
        </div>

        <dl className="mt-6 grid gap-3 rounded border border-slate-200 bg-slate-50 p-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-slate-500">Progress</dt>
            <dd className="mt-1 font-semibold text-slate-900">
              {props.summary.questionsReached}/{props.summary.totalQuestions}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Completion</dt>
            <dd className="mt-1 font-semibold text-slate-900">
              {props.summary.completionPercentage}%
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Duration</dt>
            <dd className="mt-1 font-semibold text-slate-900">
              {formatDuration(props.summary.durationSeconds)}
            </dd>
          </div>
        </dl>

        <button
          ref={closeButtonRef}
          type="button"
          onClick={props.onClose}
          className="mt-7 h-[50px] w-full cursor-pointer rounded bg-teal-600 text-base font-semibold text-white transition-colors hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
        >
          Back to MCQ Quiz
        </button>
      </div>
    </QuizModalShell>
  );
}
