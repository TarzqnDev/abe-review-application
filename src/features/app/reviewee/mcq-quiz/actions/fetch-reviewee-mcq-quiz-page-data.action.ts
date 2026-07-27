"use server";

import { fetchTodaysTrivia } from "@/features/app/reviewee/trivia/actions/fetch-todays-trivia.action";
import type { FetchTodaysTriviaResult } from "@/features/app/reviewee/trivia/types/revieweeTrivia";

export type FetchRevieweeMcqQuizPageDataResult = {
  todaysTrivia: FetchTodaysTriviaResult;
};

export const fetchRevieweeMcqQuizPageData =
  async (): Promise<FetchRevieweeMcqQuizPageDataResult> => ({
    todaysTrivia: await fetchTodaysTrivia(),
  });
