import {
  CheckCircleIcon,
  ClockIcon,
  MinusCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import type { ActivityHistoryFlashCardItem } from "@/features/app/reviewee/history/types/activityHistory";

type FlashCardHistoryDetailsItemProps = {
  item: ActivityHistoryFlashCardItem;
};

const resultDetails = (item: ActivityHistoryFlashCardItem) => {
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

const formatItemStatus = (status: string) =>
  status
    .split("_")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");

export default function FlashCardHistoryDetailsItem({
  item,
}: FlashCardHistoryDetailsItemProps) {
  const result = resultDetails(item);
  const ResultIcon = result.icon;
  const responseTime =
    item.responseTimeMs === null
      ? null
      : `${(item.responseTimeMs / 1000).toFixed(1)}s`;
  const wasAnswered =
    item.submittedAnswer !== null &&
    (item.result === "correct" || item.result === "incorrect");

  return (
    <article className="rounded border border-border bg-secondary-bg p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-secondary-text">
          Flash Card {item.order}
        </p>
        <div className={`flex items-center gap-1.5 text-sm font-medium ${result.className}`}>
          <ResultIcon className="h-4 w-4" />
          {result.label}
          <span className="font-normal text-slate-400">
            · {formatItemStatus(item.status)}
          </span>
          {responseTime && <span className="font-normal">· {responseTime}</span>}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-secondary-text">Question</p>
        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-primary-text">
          {item.prompt}
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {wasAnswered ? (
          <div
            className={`rounded border p-3 ${
              item.result === "correct"
                ? "border-teal-400 bg-teal-50"
                : "border-red-300 bg-red-50"
            }`}
          >
            <p className="text-xs font-medium text-secondary-text">Submitted answer</p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-primary-text">
              {item.submittedAnswer}
            </p>
          </div>
        ) : (
          <div className="rounded border border-border bg-surface p-3">
            <p className="text-xs font-medium text-secondary-text">
              Submitted answer
            </p>
            <p className="mt-1 text-sm text-secondary-text">
              {item.status === "timed_out"
                ? "No answer was submitted before time ran out."
                : "This flash card was not played."}
            </p>
          </div>
        )}
        <div className="rounded border border-teal-400 bg-teal-50 p-3">
          <p className="text-xs font-medium text-primary-dark">Correct answer</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-teal-900">
            {item.correctAnswer}
          </p>
        </div>
      </div>
    </article>
  );
}
