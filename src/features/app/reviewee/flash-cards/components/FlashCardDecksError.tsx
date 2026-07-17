type FlashCardDecksErrorProps = {
  message: string;
  onRetry: () => void;
};

export default function FlashCardDecksError({
  message,
  onRetry,
}: FlashCardDecksErrorProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-8 text-center">
      <p className="text-sm font-medium text-red-700">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex h-10 cursor-pointer items-center justify-center rounded border border-red-300 bg-white px-5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
      >
        Try Again
      </button>
    </div>
  );
}
