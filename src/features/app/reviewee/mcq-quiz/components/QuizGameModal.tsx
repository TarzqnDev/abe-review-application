import { ClockIcon, XMarkIcon } from "@heroicons/react/24/outline";
import ExitGameConfirmationModal from "@/features/app/reviewee/mcq-quiz/components/ExitGameConfirmationModal";
import QuizAnswerOption from "@/features/app/reviewee/mcq-quiz/components/QuizAnswerOption";
import QuizModalShell from "@/features/app/reviewee/mcq-quiz/components/QuizModalShell";
import { useQuizGameModal } from "@/features/app/reviewee/mcq-quiz/hooks/modals/useQuizGameModal";
import type {
  PreparedQuizSession,
  QuizQuestionTiming,
  QuizSummary,
} from "@/features/app/reviewee/mcq-quiz/types/quiz";

export type QuizGameModalProps = {
  initialTiming: QuizQuestionTiming | null;
  isOpen: boolean;
  onFinished: (summary: QuizSummary) => void;
  preparedSession: PreparedQuizSession | null;
};

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function QuizGameModal(props: QuizGameModalProps) {
  const {
    answerReveal,
    currentQuestion,
    currentTiming,
    error,
    handleCancelExitConfirmation,
    handleExited,
    handleOpenExitConfirmation,
    handleRetry,
    handleSelectOption,
    handleSubmitAnswer,
    isExitConfirmationOpen,
    isQuestionVisible,
    modalAccessibility,
    phase,
    remainingSeconds,
    selectedOptionId,
  } = useQuizGameModal(props);
  const { dialogRef, isVisible } = modalAccessibility;

  if (!props.preparedSession || !currentTiming || !currentQuestion) {
    return null;
  }

  const isAnswerLocked = phase !== "answering";
  const showResult =
    (phase === "result" || phase === "transitioning") &&
    answerReveal !== null;
  const showTimer = phase !== "result" && phase !== "transitioning";
  const resultIsCorrect = answerReveal?.isCorrect === true;
  const timerIsCritical = remainingSeconds <= 3;

  return (
    <>
      <QuizModalShell
        className="max-h-[calc(100dvh-2rem)] max-w-[935px] overflow-y-auto p-5 sm:p-8 lg:p-10"
        dialogRef={dialogRef}
        isInert={isExitConfirmationOpen}
        isOpen={props.isOpen}
        isVisible={isVisible}
        labelledBy="quiz-game-title"
      >
        <button
          type="button"
          onClick={handleOpenExitConfirmation}
          className="absolute top-5 right-5 cursor-pointer rounded text-slate-500 transition-colors hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 sm:top-8 sm:right-8"
          aria-label="End game"
        >
          <XMarkIcon className="h-7 w-7" />
        </button>

        <header className="border-b border-slate-200 pb-5 pr-10">
          <h2
            id="quiz-game-title"
            className="text-xl font-semibold text-slate-900"
          >
            {props.preparedSession.areaName} Quiz
          </h2>
          <p className="mt-2 text-base text-slate-500">
            {props.preparedSession.gameType} ({props.preparedSession.difficulty})
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
            {currentTiming.questionOrder}/{props.preparedSession.totalQuestions}{" "}
            Questions
          </span>
        </div>

        <div
          className={`mt-6 transition-opacity duration-300 motion-reduce:transition-none ${
            isQuestionVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-slate-900">
                Question
              </h3>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                {currentQuestion.subjectName}
              </span>
            </div>
            <div className="min-h-[130px] rounded border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-900 sm:min-h-[145px] sm:p-5">
              {currentQuestion.questionText}
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-4 text-sm font-medium text-slate-500">
              Select the correct answer
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {currentQuestion.options.map((option, optionIndex) => (
                <QuizAnswerOption
                  key={option.id}
                  answerReveal={answerReveal}
                  disabled={isAnswerLocked}
                  isSelected={selectedOptionId === option.id}
                  label={
                    OPTION_LABELS[option.sortOrder - 1] ??
                    OPTION_LABELS[optionIndex] ??
                    String(option.sortOrder)
                  }
                  onSelect={handleSelectOption}
                  option={option}
                />
              ))}
            </div>
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
            disabled={
              selectedOptionId === null || phase !== "answering"
            }
            className="mt-5 flex h-[50px] w-full cursor-pointer items-center justify-center rounded bg-teal-600 px-5 text-base font-semibold text-white transition-colors hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {phase === "checking"
              ? "Checking Answer..."
              : phase === "transitioning"
                ? "Loading Next Question..."
                : "Submit Answer"}
          </button>
        </div>
      </QuizModalShell>

      <ExitGameConfirmationModal
        isOpen={isExitConfirmationOpen}
        onCancel={handleCancelExitConfirmation}
        onExited={handleExited}
        sessionId={props.preparedSession.sessionId}
      />
    </>
  );
}
