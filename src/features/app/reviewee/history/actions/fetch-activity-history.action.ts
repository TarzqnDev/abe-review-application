"use server";

import type { FetchActivityHistoryResult } from "@/features/app/reviewee/history/types/activityHistory";
import {
  getActivityHistoryError,
  mapActivityHistoryRow,
} from "@/features/app/reviewee/history/utils/activityHistoryMappers";
import { createRevieweeHistoryActionClient } from "@/features/app/reviewee/history/utils/createRevieweeHistoryActionClient";

export const fetchActivityHistory = async (): Promise<FetchActivityHistoryResult> => {
  try {
    const supabase = await createRevieweeHistoryActionClient();
    const { data, error } = await supabase
      .from("game_sessions")
      .select(`
        *,
        game_session_flash_cards(status, result),
        game_session_questions(status, result)
      `)
      .in("status", ["completed", "exited", "cancelled"])
      .order("ended_at", { ascending: false, nullsFirst: false })
      .order("id", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      history: (data ?? []).map(mapActivityHistoryRow),
    };
  } catch (error: unknown) {
    return {
      success: false,
      history: [],
      error: getActivityHistoryError(error, "Unable to load activity history"),
    };
  }
};
