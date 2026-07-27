"use server";

import type { FetchTodaysTriviaResult } from "@/features/app/reviewee/trivia/types/revieweeTrivia";
import { createRevieweeTriviaActionClient } from "@/features/app/reviewee/trivia/utils/createRevieweeTriviaActionClient";
import { getManilaDateValue } from "@/features/app/reviewee/trivia/utils/getManilaDateValue";

export const fetchTodaysTrivia =
  async (): Promise<FetchTodaysTriviaResult> => {
    const queriedDate = getManilaDateValue();

    try {
      const supabase = await createRevieweeTriviaActionClient();
      const { data, error } = await supabase
        .from("trivias")
        .select("content, publish_date")
        .eq("publish_date", queriedDate)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      return {
        queriedDate,
        success: true,
        trivia: data
          ? {
              content: data.content,
              publishDate: data.publish_date,
            }
          : null,
      };
    } catch (error: unknown) {
      console.error(error);

      return {
        success: false,
        error: "Unable to load today's trivia.",
        trivia: null,
      };
    }
  };
