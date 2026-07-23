import type { AdminSubjectArea } from "@/features/app/admin/question-bank/actions/fetch-subject-areas.action";
import BookPileIconImage from "@/public/book-pile.png";
import Image from "next/image";

type SubjectIntroCardProps = {
  onAddSubject: (areaId: number) => void;
  subjectAreas: AdminSubjectArea[];
};

export default function SubjectIntroCard({
  onAddSubject,
  subjectAreas,
}: SubjectIntroCardProps) {
  return (
    <div className="rounded-md border border-primary-accent bg-teal-50 px-6 py-10">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <Image
          src={BookPileIconImage}
          alt="Book pile image"
          width={110}
          height={110}
        />
        <h2 className="text-xl font-semibold text-primary-text">
          Create New Subject
        </h2>
        <p className="mt-3 text-sm text-secondary-text">
          Choose an Area and create a new subject
        </p>
        <div className="mt-8 grid w-full gap-4 sm:grid-cols-3">
          {subjectAreas.map((subjectArea) => (
            <button
              key={subjectArea.id}
              type="button"
              onClick={() => onAddSubject(subjectArea.id)}
              className="cursor-pointer rounded bg-primary-accent px-5 py-3 text-sm font-medium text-surface transition-colors hover:bg-primary-dark"
            >
              Add to {subjectArea.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
