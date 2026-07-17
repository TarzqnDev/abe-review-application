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
    ? "border-teal-500 bg-teal-50 text-teal-900"
    : isSelectedIncorrect
      ? "border-red-400 bg-red-50 text-red-800"
      : isSelected
        ? "border-teal-500 bg-teal-50 text-slate-900"
        : "border-slate-200 bg-white text-slate-900 hover:border-teal-300";

  const radioClassName = isCorrect
    ? "border-teal-600 bg-teal-600 ring-2 ring-white ring-inset"
    : isSelectedIncorrect
      ? "border-red-500 bg-red-500 ring-2 ring-white ring-inset"
      : isSelected
        ? "border-teal-600 bg-teal-600 ring-2 ring-white ring-inset"
        : "border-slate-300 bg-white";

  return (
    <button
      type="button"
      onClick={() => onSelect(option.id)}
      disabled={disabled}
      className={`min-h-[58px] w-full cursor-pointer rounded border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-default ${stateClassName}`}
      aria-pressed={isSelected}
    >
      <span className="flex items-start gap-3">
        <span
          className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border ${radioClassName}`}
        />
        <span className="min-w-0">
          <span className="block text-sm font-semibold">Option {label}</span>
          <span className="mt-1 block break-words text-sm leading-5">
            {option.text}
          </span>
        </span>
      </span>
    </button>
  );
}
