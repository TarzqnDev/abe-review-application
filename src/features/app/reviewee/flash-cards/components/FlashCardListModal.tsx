import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import DeleteFlashCardConfirmationModal from "@/features/app/reviewee/flash-cards/components/DeleteFlashCardConfirmationModal";
import { useFlashCardListModal } from "@/features/app/reviewee/flash-cards/hooks/modals/useFlashCardListModal";
import type {
  FlashCard,
  FlashCardDeck,
} from "@/features/app/reviewee/flash-cards/types/flashCard";
import { useModalAnimation } from "@/hooks/useModalAnimation";

type FlashCardListModalProps = {
  flashCardDeck: FlashCardDeck | null;
  loadFlashCardDecks: () => Promise<void>;
  onAddFlashCard: (areaId: number) => void;
  onClose: () => void;
  onEditFlashCard: (areaId: number, flashCard: FlashCard) => void;
  showSuccessMessage: (message: string) => void;
};

export default function FlashCardListModal({
  flashCardDeck,
  loadFlashCardDecks,
  onAddFlashCard,
  onClose,
  onEditFlashCard,
  showSuccessMessage,
}: FlashCardListModalProps) {
  const {
    dialogRef,
    filteredFlashCards,
    handleAddFlashCard,
    handleCloseDeleteConfirmation,
    handleCloseFlashCardListModal,
    handleEditFlashCard,
    handleOpenDeleteConfirmation,
    searchQuery,
    searchInputRef,
    selectedDeleteFlashCard,
    setSearchQuery,
  } = useFlashCardListModal({
    flashCardDeck,
    onAddFlashCard,
    onClose,
    onEditFlashCard,
  });
  const { closeWithAnimation, isModalVisible } = useModalAnimation(
    flashCardDeck !== null,
  );
  const flashCardCount = flashCardDeck?.cards.length ?? 0;
  const hasReachedCardLimit = flashCardCount >= (flashCardDeck?.maxCards ?? 100);

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto px-4 py-6 transition-opacity duration-300 ${
          isModalVisible
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="flash-card-list-modal-title"
        aria-hidden={!isModalVisible}
      >
        <div
          className="absolute inset-0 bg-slate-950/35"
          onClick={() =>
            closeWithAnimation(handleCloseFlashCardListModal)
          }
        ></div>

        <div
          ref={dialogRef}
          className={`relative flex max-h-[calc(100vh-3rem)] w-full max-w-[935px] flex-col rounded-md bg-white p-5 shadow-xl transition-all duration-300 ease-out sm:p-9 ${
            isModalVisible
              ? "translate-y-0 scale-100 opacity-100"
              : "-translate-y-4 scale-95 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
            <div>
              <h2
                id="flash-card-list-modal-title"
                className="text-xl font-semibold text-slate-950"
              >
                {flashCardDeck?.areaName}
              </h2>
              <p className="mt-2 text-base font-medium text-slate-500">
                {flashCardCount} {flashCardCount === 1 ? "Flash Card" : "Flash Cards"}
              </p>
            </div>

            <div className="flex items-center gap-4 pr-0 sm:pr-0">
              <label className="relative min-w-0 flex-1 sm:w-[275px] sm:flex-none">
                <span className="sr-only">Search flash cards</span>
                <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search a flash card"
                  className="h-10 w-full rounded-full border border-slate-200 bg-white pr-4 pl-10 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                />
              </label>
              <button
                type="button"
                onClick={() =>
                  closeWithAnimation(handleCloseFlashCardListModal)
                }
                className="shrink-0 cursor-pointer rounded text-slate-500 transition-colors hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                aria-label="Close flash card list"
              >
                <XMarkIcon className="h-7 w-7" />
              </button>
            </div>
          </div>

          <div className="min-h-0 overflow-y-auto pt-5">
            <button
              type="button"
              onClick={handleAddFlashCard}
              disabled={hasReachedCardLimit}
              className="flex h-10 w-full cursor-pointer items-center justify-center rounded border border-slate-200 bg-white text-sm font-semibold text-slate-950 transition-colors hover:border-teal-600 hover:text-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            >
              {hasReachedCardLimit ? "Flash Card Limit Reached" : "+ Add Flash Card"}
            </button>

            <div className="mt-5 flex flex-col gap-3">
              {filteredFlashCards.length > 0 ? (
                filteredFlashCards.map((flashCard) => {
                  const flashCardNumber =
                    (flashCardDeck?.cards.findIndex(
                      (deckFlashCard) => deckFlashCard.id === flashCard.id,
                    ) ?? 0) + 1;

                  return (
                    <article
                      key={flashCard.id}
                      className="rounded border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="mb-3 flex items-start justify-between gap-4">
                        <h3 className="text-sm font-semibold text-slate-950">
                          Flash Card #{flashCardNumber}
                        </h3>
                        <div className="flex shrink-0 items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleEditFlashCard(flashCard)}
                            className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                            aria-label={`Edit flash card ${flashCardNumber}`}
                          >
                            <PencilSquareIcon className="h-4 w-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenDeleteConfirmation(flashCard)
                            }
                            className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                            aria-label={`Delete flash card ${flashCardNumber}`}
                          >
                            <TrashIcon className="h-4 w-4" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </div>

                      <p className="whitespace-pre-wrap text-sm leading-5 text-slate-950">
                        {flashCard.question}
                      </p>

                      <div className="mt-5">
                        <p className="mb-2 text-sm font-semibold text-slate-950">
                          Answer:
                        </p>
                        <div className="whitespace-pre-wrap rounded border border-teal-600 bg-teal-50 px-3 py-2 text-sm font-medium text-teal-700">
                          {flashCard.answer}
                        </div>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="rounded border border-slate-200 bg-slate-50 p-5 text-center text-sm text-slate-500">
                  {searchQuery.trim()
                    ? "No flash cards match your search."
                    : "No flash cards yet."}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals Section */}
      <DeleteFlashCardConfirmationModal
        key={selectedDeleteFlashCard?.id ?? "delete-flash-card-confirmation"}
        flashCard={selectedDeleteFlashCard}
        loadFlashCardDecks={loadFlashCardDecks}
        onClose={handleCloseDeleteConfirmation}
        showSuccessMessage={showSuccessMessage}
      />
    </>
  );
}
