import {
  CheckCircleIcon,
  ClockIcon,
  MinusCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import type { ActivityHistoryMcqItem } from "@/features/app/reviewee/history/types/activityHistory";

type McqHistoryDetailsItemProps = {
  item: ActivityHistoryMcqItem;
};

const resultDetails = (item: ActivityHistoryMcqItem) => {
  if (item.result === "correct") {
    return { icon: CheckCircleIcon, label: "Correct", className: "text-primary-accent" };
  }
  if (item.result === "incorrect") {
    return { icon: XCircleIcon, label: "Incorrect", className: "text-red-600" };
  }
  if (item.status === "timed_out") {
    return { icon: ClockIcon, label: "Timed Out", className: "text-amber-600" };
  }
  return { icon: MinusCircleIcon, label: "Not Played", className: "text-secondary-text" };
};

const formatResponseTime = (responseTimeMs: number | null) =>
  responseTimeMs === null ? null : `${(responseTimeMs / 1000).toFixed(1)}s`;

const formatItemStatus = (status: string) =>
  status
    .split("_")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");

export default function McqHistoryDetailsItem({
  item,
}: McqHistoryDetailsItemProps) {
  const result = resultDetails(item);
  const ResultIcon = result.icon;
  const responseTime = formatResponseTime(item.responseTimeMs);

  return (
    <article className="rounded border border-border bg-surface p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-secondary-text">
            Question {item.order}
          </p>
          <p className="mt-1 text-sm text-secondary-text">{item.subjectName}</p>
        </div>
        <div className={`flex items-center gap-1.5 text-sm font-medium ${result.className}`}>
          <ResultIcon className="h-4 w-4" />
          {result.label}
          <span className="font-normal text-slate-400">
            · {formatItemStatus(item.status)}
          </span>
          {responseTime && <span className="font-normal">· {responseTime}</span>}
        </div>
      </div>

      <p className="mt-4 whitespace-pre-wrap text-sm font-medium leading-6 text-primary-text">
        {item.prompt}
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {item.options.map((option) => {
          const isCorrect = item.correctOption?.id === option.id;
          const isSelected = item.selectedOption?.id === option.id;
          const isIncorrectSelection = isSelected && !isCorrect;
          const optionClassName = isCorrect
            ? "border-primary-light bg-teal-50 text-teal-800"
            : isIncorrectSelection
              ? "border-red-400 bg-red-50 text-red-700"
              : "border-border bg-surface text-slate-700";

          return (
            <div
              key={option.id}
              className={`flex min-h-11 items-center justify-between gap-3 rounded border px-3 py-2 text-sm ${optionClassName}`}
            >
              <span>{option.text}</span>
              <span className="shrink-0 text-xs font-semibold">
                {isCorrect && isSelected
                  ? "Selected · Correct"
                  : isCorrect
                    ? "Correct"
                    : isIncorrectSelection
                      ? "Selected"
                      : ""}
              </span>
            </div>
          );
        })}
      </div>

      {!item.selectedOption && item.status !== "timed_out" && (
        <p className="mt-3 text-xs text-secondary-text">No answer was submitted.</p>
      )}
    </article>
  );
}
