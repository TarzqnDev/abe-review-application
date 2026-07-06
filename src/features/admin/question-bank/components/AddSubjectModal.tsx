import type { AdminSubjectArea } from "@/features/admin/question-bank/actions/fetch-subject-areas.action";
import { LoaderCircle } from "lucide-react";
import { XMarkIcon } from "@heroicons/react/24/outline";

type AddSubjectModalProps = {
  error?: string;
  isCreatingSubject: boolean;
  onClose: () => void;
  onCreateSubject: (event: React.FormEvent<HTMLFormElement>) => Promise<{
    success: boolean;
    message: string;
  }>;
  onSubjectInput: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  open: boolean;
  subjectAreas: AdminSubjectArea[];
  subjectFormData: {
    areaId: string;
    subjectName: string;
  };
};

export default function AddSubjectModal({
  error,
  isCreatingSubject,
  onClose,
  onCreateSubject,
  onSubjectInput,
  open,
  subjectAreas,
  subjectFormData,
}: AddSubjectModalProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-opacity duration-300 ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-slate-950/30" onClick={onClose}></div>

      <div
        className={`relative w-full max-w-[525px] rounded-md bg-white p-9 shadow-xl transition-all duration-300 ease-out ${
          open ? "translate-y-0 scale-100 opacity-100" : "-translate-y-4 scale-95 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-9 right-9 cursor-pointer"
        >
          <XMarkIcon className="h-7 w-7 text-slate-500" />
        </button>

        <h2 className="mb-8 text-xl font-semibold text-slate-950">
          Add New Subject
        </h2>

        <form onSubmit={onCreateSubject} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="areaId" className="text-sm font-semibold">
              Area
            </label>
            <select
              id="areaId"
              name="areaId"
              value={subjectFormData.areaId}
              onChange={onSubjectInput}
              required
              className="h-[50px] w-full rounded border border-slate-200 bg-white px-5 text-base text-slate-950 outline-none focus:border-teal-600"
            >
              {subjectAreas.map((subjectArea) => (
                <option key={subjectArea.id} value={subjectArea.id}>
                  {subjectArea.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="subjectName" className="text-sm font-semibold">
              Subject Name
            </label>
            <input
              id="subjectName"
              name="subjectName"
              type="text"
              value={subjectFormData.subjectName}
              onChange={onSubjectInput}
              required
              maxLength={255}
              className="h-[50px] w-full rounded border border-slate-200 px-5 text-base text-slate-950 outline-none focus:border-teal-600"
            />
          </div>

          <p className="text-xs text-slate-500">
            ✓ You can add questions to this subject after creating it
          </p>

          <button
            type="submit"
            disabled={isCreatingSubject}
            className="flex h-[50px] cursor-pointer items-center justify-center rounded bg-teal-600 px-5 text-base font-semibold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isCreatingSubject ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Create Subject"
            )}
          </button>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
}
