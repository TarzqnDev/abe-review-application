import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { LoaderCircle } from "lucide-react";
import QuizModalShell from "@/features/app/reviewee/mcq-quiz/components/QuizModalShell";
import { useGameSelectionModal } from "@/features/app/reviewee/mcq-quiz/hooks/modals/useGameSelectionModal";
import type {
  PreparedQuizSession,
  QuizGameType,
} from "@/features/app/reviewee/mcq-quiz/types/quiz";

export type GameSelectionModalProps = {
  gameType: QuizGameType | null;
  isOpen: boolean;
  onClose: () => void;
  onNoQuestions: () => void;
  onPrepared: (session: PreparedQuizSession) => void;
};

export default function GameSelectionModal(
  props: GameSelectionModalProps,
) {
  const {
    areaSelectRef,
    areas,
    difficulty,
    error,
    handleClose,
    handleStartNow,
    isLoadingAreas,
    isPreparing,
    modalAccessibility,
    quizDifficulties,
    selectedAreaId,
    setDifficulty,
    setSelectedAreaId,
  } = useGameSelectionModal(props);
  const {
    dialogRef,
    handleBackdropMouseDown,
    isVisible,
  } = modalAccessibility;

  if (!props.gameType) return null;

  return (
    <QuizModalShell
      className="max-w-[525px] px-6 py-8 sm:px-9 sm:py-10"
      dialogRef={dialogRef}
      isOpen={props.isOpen}
      isVisible={isVisible}
      labelledBy="game-selection-title"
      onBackdropMouseDown={handleBackdropMouseDown}
    >
      <div className="mb-8 flex items-center justify-between gap-5">
        <h2
          id="game-selection-title"
          className="text-xl font-semibold text-slate-900"
        >
          {props.gameType}
        </h2>
        <button
          type="button"
          onClick={handleClose}
          disabled={isPreparing}
          className="cursor-pointer rounded text-slate-500 transition-colors hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Close game selection"
        >
          <XMarkIcon className="h-7 w-7" />
        </button>
      </div>

      <div className="space-y-5">
        <label className="block text-sm font-semibold text-slate-900">
          Select Area
          <span className="relative mt-2 block">
            <select
              ref={areaSelectRef}
              value={selectedAreaId}
              onChange={(event) => setSelectedAreaId(event.target.value)}
              disabled={
                isLoadingAreas ||
                isPreparing ||
                areas.length === 0
              }
              className="h-[50px] w-full appearance-none rounded border border-slate-200 bg-white px-4 pr-11 text-base font-medium text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            >
              {isLoadingAreas ? (
                <option value="">Loading areas...</option>
              ) : areas.length === 0 ? (
                <option value="">No areas available</option>
              ) : (
                areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))
              )}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-slate-500" />
          </span>
        </label>

        <label className="block text-sm font-semibold text-slate-900">
          Select Difficulty
          <span className="relative mt-2 block">
            <select
              value={difficulty}
              onChange={(event) =>
                setDifficulty(event.target.value as typeof difficulty)
              }
              disabled={isPreparing}
              className="h-[50px] w-full appearance-none rounded border border-slate-200 bg-white px-4 pr-11 text-base font-medium text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            >
              {quizDifficulties.map((difficultyOption) => (
                <option key={difficultyOption} value={difficultyOption}>
                  {difficultyOption}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-slate-500" />
          </span>
        </label>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleStartNow}
          disabled={
            isLoadingAreas ||
            isPreparing ||
            !selectedAreaId
          }
          className="flex h-[50px] w-full cursor-pointer items-center justify-center rounded bg-teal-600 px-5 text-base font-semibold text-white transition-colors hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPreparing ? (
            <LoaderCircle className="h-5 w-5 animate-spin" />
          ) : (
            "Start Now"
          )}
        </button>
      </div>
    </QuizModalShell>
  );
}
