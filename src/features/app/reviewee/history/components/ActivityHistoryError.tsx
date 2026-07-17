import { ArrowPathIcon } from "@heroicons/react/24/outline";

type ActivityHistoryErrorProps = {
  message: string;
  onRetry: () => void;
};

export default function ActivityHistoryError({
  message,
  onRetry,
}: ActivityHistoryErrorProps) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 p-6 text-center"
    >
      <p className="text-sm text-red-700">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded border border-red-300 bg-white px-4 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
      >
        <ArrowPathIcon className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );
}
