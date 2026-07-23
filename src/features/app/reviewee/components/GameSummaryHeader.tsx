import { CheckIcon } from "@heroicons/react/24/outline";

type GameSummaryHeaderProps = {
  metadata: string;
  title: string;
  titleId: string;
};

export default function GameSummaryHeader({
  metadata,
  title,
  titleId,
}: GameSummaryHeaderProps) {
  return (
    <header className="flex min-h-[150px] flex-col items-center justify-center bg-primary-accent px-6 py-4 text-center text-surface">
      <div
        className="flex h-[52px] w-[52px] items-center justify-center rounded-full border-2 border-surface"
        aria-hidden="true"
      >
        <CheckIcon className="h-8 w-8 stroke-2" />
      </div>
      <h2 id={titleId} className="mt-3 text-xl font-semibold leading-6">
        {title}
      </h2>
      <p className="mt-1 text-sm">{metadata}</p>
    </header>
  );
}
