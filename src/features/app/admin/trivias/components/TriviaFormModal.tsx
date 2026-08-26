import { XMarkIcon } from "@heroicons/react/24/outline";
import { LoaderCircle } from "lucide-react";
import { useTriviaFormModal } from "@/features/app/admin/trivias/hooks/modals/useTriviaFormModal";
import type {
  AdminTrivia,
  TriviaFormModalRequest,
} from "@/features/app/admin/trivias/types/adminTrivia";
import { useModalAnimation } from "@/hooks/useModalAnimation";

type TriviaFormModalProps = {
  isDeleteConfirmationOpen: boolean;
  loadTrivias: () => Promise<void>;
  onClose: () => void;
  onRequestDelete: (trivia: AdminTrivia) => void;
  request: TriviaFormModalRequest | null;
  showSuccessMessage: (message: string) => void;
};

export default function TriviaFormModal({
  isDeleteConfirmationOpen,
  loadTrivias,
  onClose,
  onRequestDelete,
  request,
  showSuccessMessage,
}: TriviaFormModalProps) {
  const { closeWithAnimation, isModalVisible } = useModalAnimation(
    request !== null,
  );
  const {
    content,
    dialogRef,
    formError,
    handleClose,
    handleSaveTrivia,
    isEditMode,
    isSaving,
    publishDate,
    setContent,
    setPublishDate,
    todayDate,
  } = useTriviaFormModal({
    closeWithAnimation,
    isDeleteConfirmationOpen,
    loadTrivias,
    onClose,
    request,
    showSuccessMessage,
  });
  const modalTitle = isEditMode ? "Edit Trivia" : "Create Trivia";

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto px-4 py-6 transition-opacity duration-300 ${
        isModalVisible
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="trivia-form-modal-title"
      aria-hidden={!isModalVisible || isDeleteConfirmationOpen}
      inert={!isModalVisible || isDeleteConfirmationOpen}
    >
      <button
        type="button"
        onClick={handleClose}
        className="absolute inset-0 cursor-default bg-slate-950/35"
        aria-label={`Close ${modalTitle.toLowerCase()} modal`}
        tabIndex={-1}
      />

      <div
        ref={dialogRef}
        tabIndex={-1}
        className={`relative max-h-[calc(100vh-3rem)] w-full max-w-[560px] overflow-y-auto rounded-md bg-surface p-7 shadow-xl transition-all duration-300 ease-out sm:p-9 ${
          isModalVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "-translate-y-4 scale-95 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={handleClose}
          disabled={isSaving}
          className="absolute top-7 right-7 cursor-pointer rounded text-secondary-text transition-colors hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent disabled:cursor-not-allowed disabled:opacity-50 sm:top-9 sm:right-9"
          aria-label={`Close ${modalTitle.toLowerCase()} modal`}
        >
          <XMarkIcon className="h-7 w-7" aria-hidden="true" />
        </button>

        <h2
          id="trivia-form-modal-title"
          className="mb-8 pr-12 text-xl font-semibold text-primary-text"
        >
          {modalTitle}
        </h2>

        <form onSubmit={handleSaveTrivia} className="flex flex-col gap-5">
          <label
            htmlFor="trivia-content"
            className="text-sm font-semibold text-primary-text"
          >
            Trivia Content
            <textarea
              id="trivia-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              disabled={isSaving}
              rows={7}
              maxLength={1000}
              required
              className="mt-2 w-full resize-none rounded border border-border px-4 py-3 text-sm font-normal leading-6 text-primary-text outline-none transition-colors placeholder:text-slate-400 focus:border-primary-accent focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-secondary-bg"
              placeholder="Share an interesting ABE fact or insight"
            />
          </label>

          <label
            htmlFor="trivia-publish-date"
            className="text-sm font-semibold text-primary-text"
          >
            Publish Date
            <input
              id="trivia-publish-date"
              type="date"
              value={publishDate}
              min={todayDate}
              onChange={(event) => setPublishDate(event.target.value)}
              disabled={request?.isPublishDateLocked === true || isSaving}
              required
              className="mt-2 h-[50px] w-full rounded border border-border bg-surface px-4 text-base font-normal text-slate-700 outline-none transition-colors focus:border-primary-accent focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-secondary-bg"
            />
          </label>

          {formError && (
            <p role="alert" className="text-sm text-red-600">
              {formError}
            </p>
          )}

          <div className={`grid gap-3 ${isEditMode ? "sm:grid-cols-2" : ""}`}>
            <button
              type="submit"
              disabled={isSaving}
              className="flex h-[50px] cursor-pointer items-center justify-center rounded bg-primary-accent px-5 text-base font-semibold text-surface transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? (
                <LoaderCircle className="h-5 w-5 animate-spin" aria-label="Saving" />
              ) : isEditMode ? (
                "Save Edit"
              ) : (
                "Create Trivia"
              )}
            </button>

            {isEditMode && request?.trivia && (
              <button
                type="button"
                onClick={() => onRequestDelete(request.trivia as AdminTrivia)}
                disabled={isSaving}
                className="flex h-[50px] cursor-pointer items-center justify-center rounded border border-primary-accent bg-surface px-5 text-base font-semibold text-primary-accent transition-colors hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent disabled:cursor-not-allowed disabled:opacity-60"
              >
                Delete Trivia
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
