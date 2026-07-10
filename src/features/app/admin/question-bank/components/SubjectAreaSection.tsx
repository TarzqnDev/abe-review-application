import type {
  AdminSubject,
  AdminSubjectArea,
} from "@/features/app/admin/question-bank/actions/fetch-subject-areas.action";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

type SubjectAreaSectionProps = {
  onOpenSubjectDetails: (subject: AdminSubject) => void;
  subjectArea: AdminSubjectArea;
};

export default function SubjectAreaSection({
  onOpenSubjectDetails,
  subjectArea,
}: SubjectAreaSectionProps) {
  return (
    <section className="mb-8">
      <div className="mb-5 flex items-center gap-3 border-b border-slate-200 pb-5">
        <h2 className="text-xl font-semibold text-slate-950">
          {subjectArea.name}
        </h2>
        <span className="rounded-full bg-teal-50 px-3 py-1 text-[10px] font-medium text-teal-600">
          {subjectArea.subjects.length}{" "}
          {subjectArea.subjects.length === 1 ? "Subject" : "Subjects"}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {subjectArea.subjects.length > 0 ? (
          subjectArea.subjects.map((subject) => (
            <button
              key={subject.id}
              type="button"
              onClick={() => onOpenSubjectDetails(subject)}
              className="group flex min-h-12 w-full cursor-pointer items-center justify-between rounded border border-slate-200 bg-white px-5 text-left text-base font-medium text-slate-950 transition-colors hover:border-teal-600"
            >
              <span>{subject.name}</span>
              <ArrowTopRightOnSquareIcon className="h-5 w-5 text-slate-500 transition-colors group-hover:text-teal-600" />
            </button>
          ))
        ) : (
          <div className="rounded border border-slate-200 bg-white px-5 py-4 text-sm text-slate-500">
            No subjects yet.
          </div>
        )}
      </div>
    </section>
  );
}
