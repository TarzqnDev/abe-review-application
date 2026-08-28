import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import DeleteFlashCardConfirmationModal from "@/features/app/reviewee/flash-cards/components/DeleteFlashCardConfirmationModal";
import FlashCardFormModal from "@/features/app/reviewee/flash-cards/components/FlashCardFormModal";
import FlashCardListPagination from "@/features/app/reviewee/flash-cards/components/FlashCardListPagination";
import { useFlashCardListModal } from "@/features/app/reviewee/flash-cards/hooks/modals/useFlashCardListModal";
import {
  MAX_FLASH_CARDS_PER_DECK,
  type FlashCardDeck,
} from "@/features/app/reviewee/flash-cards/types/flashCard";
import { useModalAnimation } from "@/hooks/useModalAnimation";

type FlashCardListModalProps = {
  flashCardDeck: FlashCardDeck | null;
  loadFlashCardDecks: () => Promise<void>;
  onClose: () => void;
  showSuccessMessage: (message: string) => void;
};

export default function FlashCardListModal({
  flashCardDeck,
  loadFlashCardDecks,
  onClose,
  showSuccessMessage,
}: FlashCardListModalProps) {
  const flashCardListModal = useFlashCardListModal({
    flashCardDeck,
    onClose,
  });
  const modalAnimation = useModalAnimation(
    flashCardDeck !== null,
  );
  const flashCardCount = flashCardDeck?.cards.length ?? 0;
  const hasReachedCardLimit =
    flashCardCount >= (flashCardDeck?.maxCards ?? MAX_FLASH_CARDS_PER_DECK);

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto px-4 py-4 transition-opacity duration-300 sm:py-6 ${
          modalAnimation.isModalVisible
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        role="dialog"
        aria-modal={!flashCardListModal.isNestedModalOpen}
        aria-labelledby="flash-card-list-modal-title"
        aria-hidden={
          !modalAnimation.isModalVisible || flashCardListModal.isNestedModalOpen
        }
        inert={flashCardListModal.isNestedModalOpen}
      >
        <div
          className="absolute inset-0 bg-slate-950/35"
          onClick={() =>
            modalAnimation.closeWithAnimation(
              flashCardListModal.handleCloseFlashCardListModal,
            )
          }
        ></div>

        <div
          ref={flashCardListModal.dialogRef}
          tabIndex={-1}
          className={`relative flex max-h-[calc(100dvh-2rem)] w-full max-w-[935px] flex-col rounded-md bg-surface p-5 shadow-xl transition-all duration-300 ease-out sm:max-h-[calc(100vh-3rem)] sm:p-9 ${
            modalAnimation.isModalVisible
              ? "translate-y-0 scale-100 opacity-100"
              : "-translate-y-4 scale-95 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
            <div>
              <h2
                id="flash-card-list-modal-title"
                className="text-xl font-semibold text-primary-text"
              >
                {flashCardDeck?.areaName}
              </h2>
              <p className="mt-2 text-base font-medium text-secondary-text">
                {flashCardCount} {flashCardCount === 1 ? "Flash Card" : "Flash Cards"}
              </p>
            </div>

            <div className="flex items-center gap-4 pr-0 sm:pr-0">
              <label className="relative min-w-0 flex-1 sm:w-[275px] sm:flex-none">
                <span className="sr-only">Search flash cards</span>
                <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={flashCardListModal.searchQuery}
                  onChange={flashCardListModal.handleSearchQueryChange}
                  placeholder="Search a flash card"
                  className="h-10 w-full rounded-full border border-border bg-surface pr-4 pl-10 text-sm text-primary-text outline-none placeholder:text-slate-400 focus:border-primary-accent focus:ring-2 focus:ring-teal-100"
                />
              </label>
              <button
                type="button"
                onClick={() =>
                  modalAnimation.closeWithAnimation(
                    flashCardListModal.handleCloseFlashCardListModal,
                  )
                }
                className="shrink-0 cursor-pointer rounded text-secondary-text transition-colors hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
                aria-label="Close flash card list"
              >
                <XMarkIcon className="h-7 w-7" />
              </button>
            </div>
          </div>

          <div className="min-h-0 overflow-y-auto pt-5">
            <button
              type="button"
              onClick={flashCardListModal.handleAddFlashCard}
              disabled={hasReachedCardLimit}
              className="flex h-10 w-full cursor-pointer items-center justify-center rounded border border-border bg-surface text-sm font-semibold text-primary-text transition-colors hover:border-primary-accent hover:text-primary-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light disabled:cursor-not-allowed disabled:bg-secondary-bg disabled:text-slate-400"
            >
              {hasReachedCardLimit ? "Flash Card Limit Reached" : "+ Add Flash Card"}
            </button>

            <div className="mt-5 flex flex-col gap-3">
              {flashCardListModal.paginatedFlashCards.length > 0 ? (
                flashCardListModal.paginatedFlashCards.map((flashCard) => {
                  const flashCardNumber =
                    (flashCardDeck?.cards.findIndex(
                      (deckFlashCard) => deckFlashCard.id === flashCard.id,
                    ) ?? 0) + 1;

                  return (
                    <article
                      key={flashCard.id}
                      className="rounded border border-border bg-secondary-bg p-5"
                    >
                      <div className="mb-3 flex items-start justify-between gap-4">
                        <h3 className="text-sm font-semibold text-primary-text">
                          Flash Card #{flashCardNumber}
                        </h3>
                        <div className="flex shrink-0 items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              flashCardListModal.handleEditFlashCard(flashCard)
                            }
                            className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-secondary-text transition-colors hover:text-primary-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
                            aria-label={`Edit flash card ${flashCardNumber}`}
                          >
                            <PencilSquareIcon className="h-4 w-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              flashCardListModal.handleOpenDeleteConfirmation(
                                flashCard,
                              )
                            }
                            className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-secondary-text transition-colors hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error"
                            aria-label={`Delete flash card ${flashCardNumber}`}
                          >
                            <TrashIcon className="h-4 w-4" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </div>

                      <p className="whitespace-pre-wrap text-sm leading-5 text-primary-text">
                        {flashCard.question}
                      </p>

                      <div className="mt-5">
                        <p className="mb-2 text-sm font-semibold text-primary-text">
                          Answer:
                        </p>
                        <div className="whitespace-pre-wrap rounded border border-primary-accent bg-teal-50 px-3 py-2 text-sm font-medium text-primary-dark">
                          {flashCard.answer}
                        </div>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="rounded border border-border bg-secondary-bg p-5 text-center text-sm text-secondary-text">
                  {flashCardListModal.searchQuery.trim()
                    ? "No flash cards match your search."
                    : "No flash cards yet."}
                </div>
              )}
            </div>

            <FlashCardListPagination
              currentPage={flashCardListModal.currentPage}
              firstFlashCardNumber={flashCardListModal.firstFlashCardNumber}
              lastFlashCardNumber={flashCardListModal.lastFlashCardNumber}
              onPageChange={flashCardListModal.handlePageChange}
              totalFlashCards={flashCardListModal.filteredFlashCards.length}
              totalPages={flashCardListModal.totalPages}
            />
          </div>
        </div>
      </div>

      {/* Modals Section */}
      <FlashCardFormModal
        key={
          flashCardListModal.flashCardFormRequest?.requestId ??
          "nested-flash-card-form-modal"
        }
        request={flashCardListModal.flashCardFormRequest}
        flashCardDecks={flashCardDeck ? [flashCardDeck] : []}
        loadFlashCardDecks={loadFlashCardDecks}
        onClose={flashCardListModal.handleCloseFlashCardForm}
        showSuccessMessage={showSuccessMessage}
      />
      <DeleteFlashCardConfirmationModal
        key={
          flashCardListModal.selectedDeleteFlashCard?.id ??
          "delete-flash-card-confirmation"
        }
        flashCard={flashCardListModal.selectedDeleteFlashCard}
        loadFlashCardDecks={loadFlashCardDecks}
        onClose={flashCardListModal.handleCloseDeleteConfirmation}
        showSuccessMessage={showSuccessMessage}
      />
    </>
  );
}
