import type { FlashCard } from "@/features/app/reviewee/flash-cards/types/flashCard";
import type { Tables } from "@/types/database.types";

export const mapFlashCardRow = (
  flashCard: Tables<"flash_cards">,
): FlashCard => ({
  id: flashCard.id,
  deckId: flashCard.deck_id,
  question: flashCard.question,
  answer: flashCard.answer,
  createdAt: flashCard.created_at,
  updatedAt: flashCard.updated_at,
});
