import {
  ArrowTopRightOnSquareIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import type { ActivityHistoryEntry } from "@/features/app/reviewee/history/types/activityHistory";

type ActivityHistoryListProps = {
  history: ActivityHistoryEntry[];
  onViewDetails: (history: ActivityHistoryEntry) => void;
};

const statusStyles: Record<ActivityHistoryEntry["status"], string> = {
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  exited: "border-amber-200 bg-amber-50 text-amber-700",
};

const formatStatus = (status: ActivityHistoryEntry["status"]) =>
  `${status.charAt(0).toUpperCase()}${status.slice(1)}`;

const formatDuration = (durationSeconds: number) => {
  const totalMinutes = Math.floor(durationSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const seconds = durationSeconds % 60;

  if (totalMinutes === 0) return `${seconds}s`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (seconds === 0) return `${minutes}m`;
  return `${minutes}m ${seconds}s`;
};

const formatDateTime = (dateValue: string) =>
  new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    hour: "numeric",
    hour12: true,
    minute: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateValue));

export default function ActivityHistoryList({
  history,
  onViewDetails,
}: ActivityHistoryListProps) {
  return (
    <div className="space-y-3">
      {history.map((historyEntry) => {
        const isMcqQuiz = historyEntry.sessionType === "mcq_quiz";
        const activityTitle = isMcqQuiz ? "MCQ Quiz Game" : "Flash Card Game";
        const activityMetadata = [
          historyEntry.areaName,
          isMcqQuiz ? historyEntry.gameType : null,
          historyEntry.difficulty,
        ]
          .filter(Boolean)
          .join(" · ");

        return (
          <article
            key={historyEntry.id}
            className="rounded border border-border bg-surface px-4 py-3.5 transition-colors hover:border-slate-300 sm:px-5"
          >
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,1.8fr)_132px] lg:items-center">
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-2">
                  <h3 className="min-w-0 truncate text-base font-semibold text-primary-text">
                    {activityTitle}
                  </h3>
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusStyles[historyEntry.status]}`}
                  >
                    {formatStatus(historyEntry.status)}
                  </span>
                </div>
                <p
                  className="mt-1 truncate text-sm font-medium text-secondary-text"
                  title={activityMetadata}
                >
                  {activityMetadata}
                </p>
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                  <ClockIcon className="h-4 w-4" />
                  {formatDateTime(historyEntry.terminalAt)}
                </p>
              </div>

              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
                <div className="min-w-0">
                  <dt className="whitespace-nowrap text-[13px] font-medium text-secondary-text">
                    Score
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-primary-text">
                    {historyEntry.correct}/{historyEntry.questionsReached}
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-sm font-medium text-secondary-text">
                    Accuracy
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-primary-text">
                    {historyEntry.accuracyPercentage}%
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-sm font-medium text-secondary-text">
                    Progress
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-primary-text">
                    {historyEntry.questionsReached}/{historyEntry.totalQuestions}
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-sm font-medium text-secondary-text">
                    Duration
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-primary-text">
                    {formatDuration(historyEntry.durationSeconds)}
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={() => onViewDetails(historyEntry)}
                className="inline-flex h-8 w-full shrink-0 cursor-pointer items-center justify-center gap-1 rounded border border-primary-accent bg-surface px-3 text-[11px] font-medium text-primary-accent transition-colors hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2"
              >
                View Details
                <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
