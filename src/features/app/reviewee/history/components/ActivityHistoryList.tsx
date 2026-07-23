import {
  ArrowTopRightOnSquareIcon,
  BoltIcon,
  ClockIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/outline";
import type { ActivityHistoryEntry } from "@/features/app/reviewee/history/types/activityHistory";

type ActivityHistoryListProps = {
  history: ActivityHistoryEntry[];
  onViewDetails: (history: ActivityHistoryEntry) => void;
};

const statusStyles: Record<ActivityHistoryEntry["status"], string> = {
  cancelled: "border-border bg-secondary-bg text-slate-600",
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
        const TypeIcon = isMcqQuiz ? BoltIcon : RectangleStackIcon;

        return (
          <article
            key={historyEntry.id}
            className="rounded-lg border border-border bg-surface p-5 transition-colors hover:border-slate-300"
          >
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0 xl:w-[32%]">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-teal-50 text-primary-accent">
                    <TypeIcon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-base font-semibold text-primary-text">
                        {historyEntry.areaName}
                      </h3>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusStyles[historyEntry.status]}`}
                      >
                        {formatStatus(historyEntry.status)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-secondary-text">
                      {isMcqQuiz
                        ? `MCQ Quiz · ${historyEntry.gameType}`
                        : historyEntry.gameType}
                      {historyEntry.difficulty
                        ? ` · ${historyEntry.difficulty}`
                        : ""}
                    </p>
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                      <ClockIcon className="h-4 w-4" />
                      {formatDateTime(historyEntry.terminalAt)}
                    </p>
                  </div>
                </div>
              </div>

              <dl className="grid flex-1 grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                <div>
                  <dt className="text-xs font-medium text-slate-400">Score</dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-800">
                    {historyEntry.correct}/{historyEntry.totalQuestions}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-400">
                    Accuracy
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-800">
                    {historyEntry.accuracyPercentage}%
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-400">
                    Progress
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-800">
                    {historyEntry.questionsReached}/{historyEntry.totalQuestions}
                  </dd>
                  <div
                    role="progressbar"
                    aria-label={`${historyEntry.areaName} session progress`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={historyEntry.completionPercentage}
                    className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-100"
                  >
                    <div
                      className="h-full rounded-full bg-primary-accent"
                      style={{
                        width: `${Math.min(100, historyEntry.completionPercentage)}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-400">
                    Duration
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-800">
                    {formatDuration(historyEntry.durationSeconds)}
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={() => onViewDetails(historyEntry)}
                className="inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded border border-primary-accent bg-surface px-4 text-xs font-medium text-primary-accent transition-colors hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2"
              >
                View Details
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
