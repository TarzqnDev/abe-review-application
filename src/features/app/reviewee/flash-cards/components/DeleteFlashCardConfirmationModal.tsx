import { XMarkIcon } from "@heroicons/react/24/outline";
import { LoaderCircle } from "lucide-react";
import { useDeleteFlashCardConfirmationModal } from "@/features/app/reviewee/flash-cards/hooks/modals/useDeleteFlashCardConfirmationModal";
import type { FlashCard } from "@/features/app/reviewee/flash-cards/types/flashCard";
import { useModalAnimation } from "@/hooks/useModalAnimation";

type DeleteFlashCardConfirmationModalProps = {
  flashCard: FlashCard | null;
  loadFlashCardDecks: () => Promise<void>;
  onClose: () => void;
  showSuccessMessage: (message: string) => void;
};

export default function DeleteFlashCardConfirmationModal({
  flashCard,
  loadFlashCardDecks,
  onClose,
  showSuccessMessage,
}: DeleteFlashCardConfirmationModalProps) {
  const {
    cancelButtonRef,
    deleteError,
    dialogRef,
    handleDeleteFlashCard,
    isDeleting,
  } =
    useDeleteFlashCardConfirmationModal({
      flashCard,
      loadFlashCardDecks,
      onClose,
      showSuccessMessage,
    });
  const { closeWithAnimation, isModalVisible } = useModalAnimation(
    flashCard !== null,
  );

  return (
    <div
      className={`fixed inset-0 z-[80] flex items-center justify-center px-4 transition-opacity duration-300 ${
        isModalVisible
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-flash-card-modal-title"
      aria-describedby="delete-flash-card-modal-description"
      aria-hidden={!isModalVisible}
    >
      <div
        className="absolute inset-0 bg-slate-950/40"
        onClick={() => {
          if (!isDeleting) closeWithAnimation(onClose);
        }}
      ></div>

      <form
        ref={dialogRef}
        onSubmit={handleDeleteFlashCard}
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
          className="absolute top-6 right-6 cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Close delete flash card confirmation"
        >
          <XMarkIcon className="h-6 w-6 text-slate-500" />
        </button>

        <div className="pr-9">
          <h2
            id="delete-flash-card-modal-title"
            className="text-xl font-semibold text-slate-950"
          >
            Delete Flash Card
          </h2>
          <p
            id="delete-flash-card-modal-description"
            className="mt-3 text-sm leading-6 text-slate-500"
          >
            Are you sure you want to delete this flash card? This action cannot
            be undone.
          </p>
        </div>

        {flashCard && (
          <div className="mt-5 rounded border border-slate-200 bg-slate-50 p-4">
            <p className="line-clamp-3 text-sm font-medium leading-6 text-slate-950">
              {flashCard.question}
            </p>
          </div>
        )}

        {deleteError && (
          <p role="alert" className="mt-4 text-sm text-red-500">
            {deleteError}
          </p>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={() => closeWithAnimation(onClose)}
            disabled={isDeleting}
            className="h-11 cursor-pointer rounded border border-slate-200 bg-white text-sm font-semibold text-slate-950 transition-colors hover:border-teal-600 hover:text-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isDeleting}
            className="flex h-11 cursor-pointer items-center justify-center rounded bg-red-600 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isDeleting ? (
              <LoaderCircle className="h-5 w-5 animate-spin" />
            ) : (
              "Delete Flash Card"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
