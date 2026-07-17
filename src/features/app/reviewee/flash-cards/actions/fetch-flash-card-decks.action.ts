"use server";

import {
  MAX_FLASH_CARDS_PER_DECK,
  type FetchFlashCardDecksResult,
  type FlashCardDeck,
} from "@/features/app/reviewee/flash-cards/types/flashCard";
import { createRevieweeFlashCardActionClient } from "@/features/app/reviewee/flash-cards/utils/createRevieweeFlashCardActionClient";
import { getFlashCardActionError } from "@/features/app/reviewee/flash-cards/utils/validateFlashCardActionInput";
import { mapFlashCardRow } from "@/features/app/reviewee/flash-cards/utils/mapFlashCardRow";

export const fetchFlashCardDecks = async (): Promise<FetchFlashCardDecksResult> => {
  try {
    const { supabase } = await createRevieweeFlashCardActionClient();
    const [areasResult, decksResult, cardsResult] = await Promise.all([
      supabase.from("subject_areas").select("id, name").order("id"),
      supabase
        .from("flash_card_decks")
        .select("id, area_id, updated_at")
        .order("area_id"),
      supabase
        .from("flash_cards")
        .select("id, deck_id, question, answer, created_at, updated_at")
        .order("created_at")
        .order("id"),
    ]);

    if (areasResult.error) {
      throw new Error(areasResult.error.message);
    }

    if (decksResult.error) {
      throw new Error(decksResult.error.message);
    }

    if (cardsResult.error) {
      throw new Error(cardsResult.error.message);
    }

    const deckByAreaId = new Map(
      (decksResult.data ?? []).map((deck) => [deck.area_id, deck]),
    );
    const cardsByDeckId = new Map<number, ReturnType<typeof mapFlashCardRow>[]>();

    (cardsResult.data ?? []).forEach((card) => {
      const mappedCard = mapFlashCardRow(card);
      const currentCards = cardsByDeckId.get(card.deck_id) ?? [];
      currentCards.push(mappedCard);
      cardsByDeckId.set(card.deck_id, currentCards);
    });

    const decks: FlashCardDeck[] = (areasResult.data ?? []).map((area) => {
      const deck = deckByAreaId.get(area.id);
      const cards = deck ? (cardsByDeckId.get(deck.id) ?? []) : [];

      return {
        id: deck?.id ?? null,
        areaId: area.id,
        areaName: area.name,
        cardCount: cards.length,
        maxCards: MAX_FLASH_CARDS_PER_DECK,
        updatedAt: deck?.updated_at ?? null,
        cards,
      };
    });

    return { success: true, decks };
  } catch (error: unknown) {
    return {
      success: false,
      decks: [],
      error: getFlashCardActionError(error, "Unable to load flash cards"),
    };
  }
};
