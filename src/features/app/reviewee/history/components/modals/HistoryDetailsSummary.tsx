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

export default function HistoryDetailsSummary({
  history,
}: HistoryDetailsSummaryProps) {
  const summaryItems = [
    {
      label: "Score",
      value: `${history.correct}/${history.totalQuestions}`,
    },
    {
      label: "Accuracy",
      value: `${history.accuracyPercentage}%`,
    },
    {
      label: "Progress",
      value: `${history.questionsReached}/${history.totalQuestions}`,
    },
    {
      label: "Duration",
      value: formatDuration(history.durationSeconds),
    },
  ];

  const resultItems = [
    { label: "Correct", value: history.correct },
    { label: "Incorrect", value: history.incorrect },
    { label: "Timed Out", value: history.timedOut },
    { label: "Not Played", value: history.notPlayed },
  ];

  return (
    <>
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {summaryItems.map((summaryItem) => (
          <div
            key={summaryItem.label}
            className="rounded border border-border bg-surface px-4 py-3 text-center"
          >
            <dt className="text-sm font-medium text-secondary-text">
              {summaryItem.label}
            </dt>
            <dd className="mt-1 text-base font-semibold text-primary-text">
              {summaryItem.value}
            </dd>
          </div>
        ))}
      </dl>

      <dl className="mt-3 grid gap-3 rounded border border-border bg-secondary-bg p-4 sm:grid-cols-2 lg:grid-cols-4">
        {resultItems.map((resultItem) => (
          <div key={resultItem.label}>
            <dt className="text-xs font-medium text-secondary-text">
              {resultItem.label}
            </dt>
            <dd className="mt-1 text-sm font-semibold text-primary-text">
              {resultItem.value}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
