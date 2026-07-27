"use server";

import { fetchFlashCardDecks } from "@/features/app/reviewee/flash-cards/actions/fetch-flash-card-decks.action";
import type { FetchFlashCardDecksResult } from "@/features/app/reviewee/flash-cards/types/flashCard";
import { fetchTodaysTrivia } from "@/features/app/reviewee/trivia/actions/fetch-todays-trivia.action";
import type { FetchTodaysTriviaResult } from "@/features/app/reviewee/trivia/types/revieweeTrivia";

export type FetchRevieweeFlashCardsPageDataResult = {
  flashCardDecks: FetchFlashCardDecksResult;
  todaysTrivia: FetchTodaysTriviaResult;
};

export const fetchRevieweeFlashCardsPageData =
  async (): Promise<FetchRevieweeFlashCardsPageDataResult> => {
    const [flashCardDecks, todaysTrivia] = await Promise.all([
      fetchFlashCardDecks(),
      fetchTodaysTrivia(),
    ]);

    return {
      flashCardDecks,
      todaysTrivia,
    };
  };
