"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import FlashCardDeckCard from "@/features/app/reviewee/flash-cards/components/FlashCardDeckCard";
import FlashCardDecksEmpty from "@/features/app/reviewee/flash-cards/components/FlashCardDecksEmpty";
import FlashCardDecksError from "@/features/app/reviewee/flash-cards/components/FlashCardDecksError";
import FlashCardDecksSkeleton from "@/features/app/reviewee/flash-cards/components/FlashCardDecksSkeleton";
import FlashCardFormModal from "@/features/app/reviewee/flash-cards/components/FlashCardFormModal";
import FlashCardListModal from "@/features/app/reviewee/flash-cards/components/FlashCardListModal";
import FlashCardSuccessBanner from "@/features/app/reviewee/flash-cards/components/FlashCardSuccessBanner";
import FlashCardGameCountdownModal from "@/features/app/reviewee/flash-cards/components/game/FlashCardGameCountdownModal";
import FlashCardGameModal from "@/features/app/reviewee/flash-cards/components/game/FlashCardGameModal";
import FlashCardGameSummaryModal from "@/features/app/reviewee/flash-cards/components/game/FlashCardGameSummaryModal";
import NoFlashCardsModal from "@/features/app/reviewee/flash-cards/components/game/NoFlashCardsModal";
import { useRevieweeFlashCards } from "@/features/app/reviewee/flash-cards/hooks/useRevieweeFlashCards";
import TodaysTriviaCard from "@/features/app/reviewee/trivia/components/TodaysTriviaCard";

export default function RevieweeFlashCardsPage() {
  const flashCardsPage = useRevieweeFlashCards();

  if (flashCardsPage.isLoadingInitialPageData) {
    return (
      <section aria-busy="true">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-primary-text">
            My Flash Cards
          </h1>
          <p className="mt-1 text-base text-secondary-text">
            Create and review your custom study cards
          </p>
        </header>

        <div
          aria-hidden="true"
          className="mb-7 h-10 w-40 animate-pulse rounded bg-slate-200"
        />

        <FlashCardDecksSkeleton />
      </section>
    );
  }

  return (
    <section>
      <TodaysTriviaCard
        isExpanded={flashCardsPage.todaysTriviaCard.isExpanded}
        isLoading={flashCardsPage.todaysTriviaCard.isLoading}
        loadError={flashCardsPage.todaysTriviaCard.loadError}
        retryLoadTrivia={flashCardsPage.todaysTriviaCard.retryLoadTrivia}
        toggleExpanded={flashCardsPage.todaysTriviaCard.toggleExpanded}
        trivia={flashCardsPage.todaysTriviaCard.trivia}
      />

      <FlashCardSuccessBanner message={flashCardsPage.successMessage} />

      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-primary-text">
          My Flash Cards
        </h1>
        <p className="mt-1 text-base text-secondary-text">
          Create and review your custom study cards
        </p>
      </header>

      <button
        type="button"
        onClick={flashCardsPage.openCreateFlashCardModal}
        className="mb-7 inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded bg-primary-accent px-5 text-sm font-medium text-surface transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2"
      >
        <PlusIcon className="h-4 w-4" />
        Create Flash Card
      </button>

      {flashCardsPage.gameError && (
        <p role="alert" className="mb-5 text-sm text-red-600">
          {flashCardsPage.gameError}
        </p>
      )}

      {flashCardsPage.isLoadingFlashCardDecks ? (
        <FlashCardDecksSkeleton />
      ) : flashCardsPage.flashCardDecksError ? (
        <FlashCardDecksError
          message={flashCardsPage.flashCardDecksError}
          onRetry={flashCardsPage.retryLoadFlashCardDecks}
        />
      ) : flashCardsPage.flashCardDecks.length === 0 ? (
        <FlashCardDecksEmpty />
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {flashCardsPage.flashCardDecks.map((flashCardDeck) => (
            <FlashCardDeckCard
              key={flashCardDeck.areaId}
              flashCardDeck={flashCardDeck}
              isPlayDisabled={
                flashCardsPage.isPreparingGame ||
                flashCardsPage.gameStage !== "idle"
              }
              isPlayLoading={
                flashCardsPage.preparingAreaId === flashCardDeck.areaId
              }
              onPlay={flashCardsPage.handlePlayNow}
              onViewCards={flashCardsPage.openFlashCardListModal}
            />
          ))}
        </div>
      )}

      {/* Modals Section */}
      {flashCardsPage.formModalRequest && (
        <FlashCardFormModal
          request={flashCardsPage.formModalRequest}
          flashCardDecks={flashCardsPage.flashCardDecks}
          loadFlashCardDecks={flashCardsPage.loadFlashCardDecks}
          onClose={flashCardsPage.closeFlashCardFormModal}
          showSuccessMessage={flashCardsPage.showSuccessMessage}
        />
      )}
      {flashCardsPage.selectedFlashCardDeck && (
        <FlashCardListModal
          flashCardDeck={flashCardsPage.selectedFlashCardDeck}
          loadFlashCardDecks={flashCardsPage.loadFlashCardDecks}
          onClose={flashCardsPage.closeFlashCardListModal}
          showSuccessMessage={flashCardsPage.showSuccessMessage}
        />
      )}
      <FlashCardGameCountdownModal
        isOpen={flashCardsPage.gameStage === "countdown"}
        onCancel={flashCardsPage.handleCountdownCancelled}
        onStarted={flashCardsPage.handleGameStarted}
        preparedSession={flashCardsPage.preparedSession}
      />
      <FlashCardGameModal
        key={flashCardsPage.preparedSession?.sessionId ?? "flash-card-game"}
        initialTiming={flashCardsPage.initialTiming}
        isOpen={flashCardsPage.gameStage === "playing"}
        onFinished={flashCardsPage.handleGameFinished}
        preparedSession={flashCardsPage.preparedSession}
      />
      <NoFlashCardsModal
        isOpen={flashCardsPage.noFlashCards.isOpen}
        message={flashCardsPage.noFlashCards.message}
        onClose={flashCardsPage.closeNoFlashCards}
      />
      <FlashCardGameSummaryModal
        isOpen={flashCardsPage.gameStage === "summary"}
        onClose={flashCardsPage.resetFlashCardGame}
        summary={flashCardsPage.gameSummary}
      />
    </section>
  );
}
