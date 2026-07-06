import type { AdminSubjectArea } from "@/features/admin/question-bank/actions/fetch-subject-areas.action";
import { BookOpenIcon } from "@heroicons/react/24/outline";

type SubjectIntroCardProps = {
  onAddSubject: (areaId: number) => void;
  subjectAreas: AdminSubjectArea[];
};

export default function SubjectIntroCard({
  onAddSubject,
  subjectAreas,
}: SubjectIntroCardProps) {
  return (
    <div className="rounded-md border border-teal-600 bg-teal-50 px-6 py-10">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <BookOpenIcon className="mb-6 h-16 w-16 text-teal-600" />
        <h2 className="text-xl font-semibold text-slate-950">
          Create New Subject
        </h2>
        <p className="mt-3 text-sm text-slate-500">
          Choose an Area and create a new subject
        </p>
        <div className="mt-8 grid w-full gap-4 sm:grid-cols-3">
          {subjectAreas.map((subjectArea) => (
            <button
              key={subjectArea.id}
              type="button"
              onClick={() => onAddSubject(subjectArea.id)}
              className="cursor-pointer rounded bg-teal-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-700"
            >
              Add to {subjectArea.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
