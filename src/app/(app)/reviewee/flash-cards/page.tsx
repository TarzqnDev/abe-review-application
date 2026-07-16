"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import CreateFlashCardModal from "@/features/app/reviewee/flash-cards/components/CreateFlashCardModal";
import EditFlashCardModal from "@/features/app/reviewee/flash-cards/components/EditFlashCardModal";
import FlashCardDeckCard from "@/features/app/reviewee/flash-cards/components/FlashCardDeckCard";
import { useRevieweeFlashCards } from "@/features/app/reviewee/flash-cards/hooks/useRevieweeFlashCards";

export default function RevieweeFlashCardsPage() {
  const {
    closeCreateFlashCardModal,
    closeEditFlashCardModal,
    flashCardDecks,
    isCreateFlashCardModalOpen,
    openCreateFlashCardModal,
    openEditFlashCardModal,
    selectedFlashCardDeck,
  } = useRevieweeFlashCards();

  return (
    <section>
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">My Flash Cards</h1>
        <p className="mt-1 text-base text-slate-500">
          Create and review your custom study cards
        </p>
      </header>

      <button
        type="button"
        onClick={openCreateFlashCardModal}
        className="mb-8 inline-flex h-[46px] cursor-pointer items-center justify-center gap-2 rounded bg-teal-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
      >
        <PlusIcon className="h-4 w-4" />
        Create Flash Card
      </button>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {flashCardDecks.map((flashCardDeck) => (
          <FlashCardDeckCard
            key={flashCardDeck.id}
            flashCardDeck={flashCardDeck}
            onEdit={openEditFlashCardModal}
          />
        ))}
      </div>

      {/* Modals Section */}
      {isCreateFlashCardModalOpen && (
        <CreateFlashCardModal
          isOpen={isCreateFlashCardModalOpen}
          onClose={closeCreateFlashCardModal}
        />
      )}
      {selectedFlashCardDeck && (
        <EditFlashCardModal
          flashCardDeck={selectedFlashCardDeck}
          onClose={closeEditFlashCardModal}
        />
      )}
    </section>
  );
}
