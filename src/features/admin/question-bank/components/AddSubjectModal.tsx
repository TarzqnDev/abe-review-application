import type { Dispatch, SetStateAction } from "react";
import { LoaderCircle } from "lucide-react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { AdminSubjectArea } from "@/features/admin/question-bank/actions/fetch-subject-areas.action";
import { useAddSubjectModal } from "@/features/admin/question-bank/hooks/modals/useAddSubjectModal";
import { useModalAnimation } from "@/hooks/useModalAnimation";

type AddSubjectModalProps = {
  areaId: number | null;
  loadSubjectAreas: () => Promise<void>;
  onClose: () => void;
  setIsLoadingSubjectAreas: Dispatch<SetStateAction<boolean>>;
  showSuccessMessage: (message: string) => void;
  subjectAreas: AdminSubjectArea[];
};

export default function AddSubjectModal({
  areaId,
  loadSubjectAreas,
  onClose,
  setIsLoadingSubjectAreas,
  showSuccessMessage,
  subjectAreas,
}: AddSubjectModalProps) {
  const {
    error,
    handleCloseAddSubjectModal,
    handleCreateSubject,
    handleSubjectInput,
    isCreatingSubject,
    openAddSubjectModal,
    selectedSubjectAreaName,
    subjectFormData,
  } = useAddSubjectModal({
    areaId,
    loadSubjectAreas,
    onClose,
    setIsLoadingSubjectAreas,
    showSuccessMessage,
    subjectAreas,
  });
  const { closeWithAnimation, isModalVisible } = useModalAnimation(
    openAddSubjectModal,
  );

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-opacity duration-300 ${
        isModalVisible
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      <div
        className="absolute inset-0 bg-slate-950/30"
        onClick={() => closeWithAnimation(handleCloseAddSubjectModal)}
      ></div>

      <div
        className={`relative w-full max-w-[525px] rounded-md bg-white p-9 shadow-xl transition-all duration-300 ease-out ${
          isModalVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "-translate-y-4 scale-95 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={() => closeWithAnimation(handleCloseAddSubjectModal)}
          className="absolute top-9 right-9 cursor-pointer"
        >
          <XMarkIcon className="h-7 w-7 text-slate-500" />
        </button>

        <h2 className="mb-8 text-xl font-semibold text-slate-950">
          Add New Subject
        </h2>

        <form onSubmit={handleCreateSubject} className="flex flex-col gap-5">
          <input type="hidden" name="areaId" value={subjectFormData.areaId} />

          <div className="flex flex-col gap-2">
            <label htmlFor="selectedArea" className="text-sm font-semibold">
              Area
            </label>
            <input
              id="selectedArea"
              type="text"
              value={selectedSubjectAreaName}
              readOnly
              className="h-[50px] w-full cursor-default rounded border border-slate-200 bg-slate-50 px-5 text-base font-medium text-slate-700 outline-none"
            />
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
              onChange={handleSubjectInput}
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
