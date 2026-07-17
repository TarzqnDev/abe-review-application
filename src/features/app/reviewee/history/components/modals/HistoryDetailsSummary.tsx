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
    className: "border-teal-100 bg-teal-50 text-teal-700",
    iconClassName: "text-teal-600",
  },
  {
    icon: XCircleIcon,
    label: "Incorrect",
    value: history.incorrect,
    className: "border-red-100 bg-red-50 text-red-600",
    iconClassName: "text-red-500",
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
    className: "border-slate-200 bg-slate-50 text-slate-600",
    iconClassName: "text-slate-500",
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

      <dl className="mt-4 grid gap-x-5 gap-y-4 rounded border border-slate-200 bg-slate-50 p-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-slate-500">Accuracy</dt>
          <dd className="mt-1 font-semibold text-slate-900">
            {history.accuracyPercentage}%
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Progress</dt>
          <dd className="mt-1 font-semibold text-slate-900">
            {history.questionsReached}/{history.totalQuestions}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Completion</dt>
          <dd className="mt-1 font-semibold text-slate-900">
            {history.completionPercentage}%
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Duration</dt>
          <dd className="mt-1 font-semibold text-slate-900">
            {formatDuration(history.durationSeconds)}
          </dd>
        </div>
      </dl>
    </>
  );
}
