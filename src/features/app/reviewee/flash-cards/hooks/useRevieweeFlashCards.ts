import { useState } from "react";
import { FLASH_CARD_DECKS } from "@/features/app/reviewee/flash-cards/constants/flashCards";
import type { FlashCardDeck } from "@/features/app/reviewee/flash-cards/types/flashCard";

export const useRevieweeFlashCards = () => {
  const [isCreateFlashCardModalOpen, setIsCreateFlashCardModalOpen] =
    useState(false);
  const [selectedFlashCardDeck, setSelectedFlashCardDeck] =
    useState<FlashCardDeck | null>(null);

  const openCreateFlashCardModal = () => {
    setIsCreateFlashCardModalOpen(true);
  };

  const closeCreateFlashCardModal = () => {
    setIsCreateFlashCardModalOpen(false);
  };

  const openEditFlashCardModal = (flashCardDeck: FlashCardDeck) => {
    setSelectedFlashCardDeck(flashCardDeck);
  };

  const closeEditFlashCardModal = () => {
    setSelectedFlashCardDeck(null);
  };

  return {
    closeCreateFlashCardModal,
    closeEditFlashCardModal,
    flashCardDecks: FLASH_CARD_DECKS,
    isCreateFlashCardModalOpen,
    openCreateFlashCardModal,
    openEditFlashCardModal,
    selectedFlashCardDeck,
  };
};
