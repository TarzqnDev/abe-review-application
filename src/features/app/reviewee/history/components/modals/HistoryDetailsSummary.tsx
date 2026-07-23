import {
  CheckCircleIcon,
  ClockIcon,
  MinusCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import type { ActivityHistoryEntry } from "@/features/app/reviewee/history/types/activityHistory";

type HistoryDetailsSummaryProps = {
  history: ActivityHistoryEntry;
};

const formatDuration = (durationSeconds: number) => {
  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  const seconds = durationSeconds % 60;

  return [
    hours ? `${hours}h` : "",
    minutes ? `${minutes}m` : "",
    `${seconds}s`,
  ]
    .filter(Boolean)
    .join(" ");
};

const summaryCards = (
  history: ActivityHistoryEntry,
): Array<{
  icon: typeof CheckCircleIcon;
  label: string;
  value: number;
  className: string;
  iconClassName: string;
}> => [
  {
    icon: CheckCircleIcon,
    label: "Correct",
    value: history.correct,
    className: "border-teal-100 bg-teal-50 text-primary-dark",
    iconClassName: "text-primary-accent",
  },
  {
    icon: XCircleIcon,
    label: "Incorrect",
    value: history.incorrect,
    className: "border-red-100 bg-red-50 text-red-600",
    iconClassName: "text-error",
  },
  {
    icon: ClockIcon,
    label: "Timed Out",
    value: history.timedOut,
    className: "border-amber-100 bg-amber-50 text-amber-700",
    iconClassName: "text-amber-600",
  },
  {
    icon: MinusCircleIcon,
    label: "Not Played",
    value: history.notPlayed,
    className: "border-border bg-secondary-bg text-slate-600",
    iconClassName: "text-secondary-text",
  },
];

export default function HistoryDetailsSummary({
  history,
}: HistoryDetailsSummaryProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {summaryCards(history).map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className={`rounded border p-3 text-center ${card.className}`}
            >
              <Icon className={`mx-auto h-5 w-5 ${card.iconClassName}`} />
              <p className="mt-1 text-xl font-semibold">{card.value}</p>
              <p className="text-xs">{card.label}</p>
            </div>
          );
        })}
      </div>

      <dl className="mt-4 grid gap-x-5 gap-y-4 rounded border border-border bg-secondary-bg p-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-secondary-text">Accuracy</dt>
          <dd className="mt-1 font-semibold text-primary-text">
            {history.accuracyPercentage}%
          </dd>
        </div>
        <div>
          <dt className="text-secondary-text">Progress</dt>
          <dd className="mt-1 font-semibold text-primary-text">
            {history.questionsReached}/{history.totalQuestions}
          </dd>
        </div>
        <div>
          <dt className="text-secondary-text">Completion</dt>
          <dd className="mt-1 font-semibold text-primary-text">
            {history.completionPercentage}%
          </dd>
        </div>
        <div>
          <dt className="text-secondary-text">Duration</dt>
          <dd className="mt-1 font-semibold text-primary-text">
            {formatDuration(history.durationSeconds)}
          </dd>
        </div>
      </dl>
    </>
  );
}
