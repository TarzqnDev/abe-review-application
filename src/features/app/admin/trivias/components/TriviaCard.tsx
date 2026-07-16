import type { AdminTrivia } from "@/features/app/admin/trivias/types/adminTrivia";
import { CalendarDaysIcon, LightBulbIcon } from "@heroicons/react/24/outline";

type TriviaCardProps = {
  trivia: AdminTrivia;
};

export default function TriviaCard({ trivia }: TriviaCardProps) {
  const isPublished = trivia.status === "Published";

  return (
    <article className="flex min-h-[210px] flex-col rounded-md border border-slate-200 bg-white p-6 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-600">
          <LightBulbIcon className="h-5 w-5" aria-hidden="true" />
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isPublished
              ? "bg-emerald-50 text-emerald-700"
              : "bg-sky-50 text-sky-700"
          }`}
        >
          {trivia.status}
        </span>
      </div>

      <p className="mt-5 flex-1 text-sm leading-6 font-medium text-slate-800">
        {trivia.content}
      </p>

      <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm text-slate-500">
        <CalendarDaysIcon className="h-4 w-4" aria-hidden="true" />
        <span>{isPublished ? "Published" : "Publishes"}</span>
        <time>{trivia.publishDate}</time>
      </div>
    </article>
  );
}
