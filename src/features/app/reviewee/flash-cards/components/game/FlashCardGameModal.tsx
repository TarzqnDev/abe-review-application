import { ClockIcon, XMarkIcon } from "@heroicons/react/24/outline";
import FlashCardExitGameConfirmationModal from "@/features/app/reviewee/flash-cards/components/game/FlashCardExitGameConfirmationModal";
import { useFlashCardGameModal } from "@/features/app/reviewee/flash-cards/hooks/modals/game/useFlashCardGameModal";
import type {
  FlashCardSummary,
  FlashCardTiming,
  PreparedFlashCardSession,
} from "@/features/app/reviewee/flash-cards/types/flashCardGame";
import QuizModalShell from "@/features/app/reviewee/mcq-quiz/components/QuizModalShell";

export type FlashCardGameModalProps = {
  initialTiming: FlashCardTiming | null;
  isOpen: boolean;
  onFinished: (summary: FlashCardSummary) => void;
  preparedSession: PreparedFlashCardSession | null;
};

export default function FlashCardGameModal(props: FlashCardGameModalProps) {
  const {
    answer,
    answerInputRef,
    answerReveal,
    currentFlashCard,
    currentTiming,
    error,
    handleAnswerChange,
    handleCancelExitConfirmation,
    handleExited,
    handleOpenExitConfirmation,
    handleRetry,
    handleSubmitAnswer,
    isExitConfirmationOpen,
    isFlashCardVisible,
    modalAccessibility,
    phase,
    remainingSeconds,
  } = useFlashCardGameModal(props);
  const { dialogRef, isVisible } = modalAccessibility;

  if (!props.preparedSession || !currentTiming || !currentFlashCard) {
    return null;
  }

  const isAnswerLocked = phase !== "answering";
  const showResult =
    (phase === "result" || phase === "transitioning") &&
    answerReveal !== null;
  const showTimer = phase !== "result" && phase !== "transitioning";
  const resultIsCorrect = answerReveal?.isCorrect === true;
  const resultIsIncorrect = answerReveal?.isCorrect === false;
  const timerIsCritical = remainingSeconds <= 3;

  const answerFieldClassName = resultIsCorrect
    ? "border-teal-500 bg-teal-50 text-teal-700"
    : resultIsIncorrect
      ? "border-red-400 bg-red-50 text-red-600"
      : "border-slate-200 bg-white text-slate-900";

  return (
    <>
      <QuizModalShell
        className="max-h-[calc(100dvh-2rem)] max-w-[795px] overflow-y-auto p-5 sm:p-8 lg:px-9 lg:py-10"
        dialogRef={dialogRef}
        isInert={isExitConfirmationOpen}
        isOpen={props.isOpen}
        isVisible={isVisible}
        labelledBy="flash-card-game-title"
      >
        <button
          type="button"
          onClick={handleOpenExitConfirmation}
          className="absolute top-5 right-5 cursor-pointer rounded text-slate-500 transition-colors hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 sm:top-8 sm:right-8"
          aria-label="End flash card game"
        >
          <XMarkIcon className="h-7 w-7" />
        </button>

        <header className="border-b border-slate-200 pb-5 pr-10">
          <div className="flex flex-wrap items-center gap-2">
            <h2
              id="flash-card-game-title"
              className="text-xl font-semibold text-slate-900"
            >
              {props.preparedSession.areaName}
            </h2>
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-600">
              Flash Cards
            </span>
          </div>
          <p className="mt-2 text-base text-slate-500">
            {props.preparedSession.totalFlashCards} Flash Cards
          </p>
        </header>

        <div className="relative mt-5 flex flex-col items-center gap-3 md:min-h-[48px] md:justify-center">
          <div className="relative min-h-[48px] w-full max-w-[330px]">
            <div
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                showTimer ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={!showTimer}
            >
              <div
                className="flex h-[46px] items-center gap-2 rounded border border-slate-200 bg-slate-50 px-4 text-base text-slate-500 transition-opacity duration-300"
                aria-label={`${remainingSeconds} seconds remaining`}
              >
                <ClockIcon className="h-5 w-5" />
                <span>Timer:</span>
                <span
                  className={`font-semibold tabular-nums ${
                    timerIsCritical ? "text-red-500" : "text-teal-600"
                  }`}
                >
                  {remainingSeconds}{" "}
                  {remainingSeconds === 1 ? "second" : "seconds"}
                </span>
              </div>
            </div>
            <p
              className={`absolute inset-0 flex items-center justify-center text-center text-base font-semibold transition-opacity duration-300 ${
                showResult ? "opacity-100" : "opacity-0"
              } ${resultIsCorrect ? "text-teal-600" : "text-red-500"}`}
              role="status"
              aria-live="polite"
              aria-hidden={!showResult}
            >
              {resultIsCorrect
                ? "Great job! You got the correct answer."
                : "That answer is incorrect."}
            </p>
          </div>

          <span className="self-center rounded-full bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-600 md:absolute md:top-1/2 md:right-0 md:-translate-y-1/2">
            {currentTiming.cardOrder}/{props.preparedSession.totalFlashCards}{" "}
            Flash Cards
          </span>
        </div>

        <div
          className={`mt-6 transition-opacity duration-300 motion-reduce:transition-none ${
            isFlashCardVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div>
            <h3 className="mb-2 text-base font-semibold text-slate-900">
              Question
            </h3>
            <div className="min-h-[125px] whitespace-pre-wrap rounded border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-900 sm:p-5">
              {currentFlashCard.questionText}
            </div>
          </div>

          <div className="mt-5">
            <label
              htmlFor="flash-card-game-answer"
              className="mb-2 block text-base font-semibold text-slate-900"
            >
              Answer
            </label>
            <textarea
              ref={answerInputRef}
              id="flash-card-game-answer"
              value={answer}
              onChange={(event) => handleAnswerChange(event.target.value)}
              disabled={isAnswerLocked}
              maxLength={2000}
              rows={3}
              className={`min-h-[75px] w-full resize-y rounded border p-4 text-sm leading-6 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:resize-none disabled:opacity-100 ${answerFieldClassName}`}
            />

            {resultIsIncorrect && answerReveal && (
              <p
                className="mt-3 rounded border border-teal-400 bg-teal-50 px-4 py-3 text-sm leading-6 text-teal-700"
                role="status"
              >
                <span className="font-semibold">Correct:</span>{" "}
                <span className="whitespace-pre-wrap">
                  {answerReveal.correctAnswer}
                </span>
              </p>
            )}
          </div>

          {error && (
            <div className="mt-5 flex flex-col items-start gap-3 rounded border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
              {phase !== "answering" && (
                <button
                  type="button"
                  onClick={handleRetry}
                  className="shrink-0 cursor-pointer text-sm font-semibold text-red-700 underline underline-offset-2"
                >
                  Try Again
                </button>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmitAnswer}
            disabled={!answer.trim() || phase !== "answering"}
            className="mt-5 flex h-[50px] w-full cursor-pointer items-center justify-center rounded bg-teal-600 px-5 text-base font-semibold text-white transition-colors hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {phase === "checking"
              ? "Checking Answer..."
              : phase === "transitioning"
                ? "Loading Next Flash Card..."
                : "Submit Answer"}
          </button>
        </div>
      </QuizModalShell>

      <FlashCardExitGameConfirmationModal
        isOpen={isExitConfirmationOpen}
        onCancel={handleCancelExitConfirmation}
        onExited={handleExited}
        sessionId={props.preparedSession.sessionId}
      />
    </>
  );
}
