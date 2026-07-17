export const MAX_FLASH_CARDS_PER_DECK = 100;

export type FlashCard = {
  id: number;
  deckId: number;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
};

export type FlashCardDeck = {
  id: number | null;
  areaId: number;
  areaName: string;
  cardCount: number;
  maxCards: number;
  updatedAt: string | null;
  cards: FlashCard[];
};

export type FlashCardArea = FlashCardDeck;

export type CreateFlashCardInput = {
  areaId: number;
  question: string;
  answer: string;
};

export type UpdateFlashCardInput = {
  cardId: number;
  question: string;
  answer: string;
};

export type DeleteFlashCardInput = {
  cardId: number;
};

export type FetchFlashCardDecksResult =
  | {
      success: true;
      decks: FlashCardDeck[];
    }
  | {
      success: false;
      decks: FlashCardDeck[];
      error: string;
    };

export type FlashCardMutationResult =
  | {
      success: true;
      message: string;
      card: FlashCard;
    }
  | {
      success: false;
      message: string;
      error: string;
      card: null;
    };

export type DeleteFlashCardResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message: string;
      error: string;
    };
