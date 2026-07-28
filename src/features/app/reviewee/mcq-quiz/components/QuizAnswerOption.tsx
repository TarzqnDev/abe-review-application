import type {
  PreparedQuizOption,
  QuizAnswerReveal,
} from "@/features/app/reviewee/mcq-quiz/types/quiz";

type QuizAnswerOptionProps = {
  answerReveal: QuizAnswerReveal | null;
  disabled: boolean;
  isSelected: boolean;
  label: string;
  onSelect: (optionId: number) => void;
  option: PreparedQuizOption;
};

export default function QuizAnswerOption({
  answerReveal,
  disabled,
  isSelected,
  label,
  onSelect,
  option,
}: QuizAnswerOptionProps) {
  const isCorrect = answerReveal?.correctOptionId === option.id;
  const isSelectedIncorrect =
    answerReveal !== null && isSelected && !isCorrect;

  const stateClassName = isCorrect
    ? "border-primary-light bg-teal-50 text-teal-900"
    : isSelectedIncorrect
      ? "border-red-400 bg-red-50 text-red-800"
      : isSelected
        ? "border-primary-light bg-teal-50 text-primary-text"
        : "border-border bg-surface text-primary-text hover:border-teal-300";

  const radioClassName = isCorrect
    ? "border-primary-accent bg-primary-accent ring-2 ring-surface ring-inset"
    : isSelectedIncorrect
      ? "border-error bg-error ring-2 ring-surface ring-inset"
      : isSelected
        ? "border-primary-accent bg-primary-accent ring-2 ring-surface ring-inset"
        : "border-slate-300 bg-surface";

  return (
    <div>
      <div className="mb-1.5 flex min-h-5 items-center justify-between gap-3">
        <span className="text-base font-medium text-primary-text">
          Option {label}
        </span>
        {isSelectedIncorrect && (
          <span className="text-sm font-medium text-error">Wrong Answer</span>
        )}
        {isCorrect && (
          <span className="text-sm font-medium text-primary-accent">
            Right Answer
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={() => onSelect(option.id)}
        disabled={disabled}
        className={`min-h-[50px] w-full cursor-pointer rounded border px-2 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 disabled:cursor-default ${stateClassName}`}
        aria-pressed={isSelected}
      >
        <span className="flex items-start gap-3">
          <span
            className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border ${radioClassName}`}
          />
          <span className="min-w-0 break-words text-sm leading-5">
            {option.text}
          </span>
        </span>
      </button>
    </div>
  );
}
