import { XMarkIcon } from "@heroicons/react/24/outline";
import { LoaderCircle } from "lucide-react";
import { useDeleteTriviaConfirmationModal } from "@/features/app/admin/trivias/hooks/modals/useDeleteTriviaConfirmationModal";
import type { AdminTrivia } from "@/features/app/admin/trivias/types/adminTrivia";
import { useModalAnimation } from "@/hooks/useModalAnimation";

type DeleteTriviaConfirmationModalProps = {
  loadTrivias: () => Promise<void>;
  onClose: () => void;
  onDeleted: () => void;
  showSuccessMessage: (message: string) => void;
  trivia: AdminTrivia | null;
};

export default function DeleteTriviaConfirmationModal({
  loadTrivias,
  onClose,
  onDeleted,
  showSuccessMessage,
  trivia,
}: DeleteTriviaConfirmationModalProps) {
  const { closeWithAnimation, isModalVisible } = useModalAnimation(
    trivia !== null,
  );
  const {
    cancelButtonRef,
    deleteError,
    dialogRef,
    handleDeleteTrivia,
    isDeleting,
  } = useDeleteTriviaConfirmationModal({
    loadTrivias,
    onClose,
    onDeleted,
    showSuccessMessage,
    trivia,
  });

  return (
    <div
      className={`fixed inset-0 z-[80] flex items-center justify-center px-4 transition-opacity duration-300 ${
        isModalVisible
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-trivia-modal-title"
      aria-describedby="delete-trivia-modal-description"
      aria-hidden={!isModalVisible}
    >
      <button
        type="button"
        onClick={() => {
          if (!isDeleting) closeWithAnimation(onClose);
        }}
        className="absolute inset-0 cursor-default bg-slate-950/45"
        aria-label="Close delete trivia confirmation"
        tabIndex={-1}
      />

      <form
        ref={dialogRef}
        onSubmit={handleDeleteTrivia}
        className={`relative w-full max-w-[430px] rounded-md bg-white p-7 shadow-xl transition-all duration-300 ease-out ${
          isModalVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "-translate-y-4 scale-95 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={() => closeWithAnimation(onClose)}
          disabled={isDeleting}
          className="absolute top-6 right-6 cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Close delete trivia confirmation"
        >
          <XMarkIcon className="h-6 w-6 text-slate-500" />
        </button>

        <div className="pr-9">
          <h2
            id="delete-trivia-modal-title"
            className="text-xl font-semibold text-slate-950"
          >
            Delete Trivia
          </h2>
          <p
            id="delete-trivia-modal-description"
            className="mt-3 text-sm leading-6 text-slate-500"
          >
            Are you sure you want to delete this trivia? This action cannot be
            undone.
          </p>
        </div>

        {trivia && (
          <p className="mt-5 line-clamp-3 rounded border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-950">
            {trivia.content}
          </p>
        )}

        {deleteError && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {deleteError}
          </p>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={() => closeWithAnimation(onClose)}
            disabled={isDeleting}
            className="h-11 cursor-pointer rounded border border-slate-200 bg-white text-sm font-semibold text-slate-950 transition-colors hover:border-teal-600 hover:text-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isDeleting}
            className="flex h-11 cursor-pointer items-center justify-center rounded bg-red-600 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isDeleting ? (
              <LoaderCircle className="h-5 w-5 animate-spin" aria-label="Deleting" />
            ) : (
              "Delete Trivia"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
