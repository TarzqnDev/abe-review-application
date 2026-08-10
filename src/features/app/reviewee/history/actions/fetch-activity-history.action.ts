"use server";

import type { FetchActivityHistoryResult } from "@/features/app/reviewee/history/types/activityHistory";
import {
  emptyActivityHistoryOverviewStats,
  getActivityHistoryError,
  mapActivityHistoryOverviewStats,
  mapActivityHistoryRow,
} from "@/features/app/reviewee/history/utils/activityHistoryMappers";
import { createRevieweeHistoryActionClient } from "@/features/app/reviewee/history/utils/createRevieweeHistoryActionClient";

export const fetchActivityHistory = async (): Promise<FetchActivityHistoryResult> => {
  try {
    const supabase = await createRevieweeHistoryActionClient();
    const [historyResult, statsResult] = await Promise.all([
      supabase
        .from("game_sessions")
        .select(`
          *,
          game_session_flash_cards(status, result),
          game_session_questions(status, result)
        `)
        .in("status", ["completed", "exited"])
        .order("ended_at", { ascending: false, nullsFirst: false })
        .order("id", { ascending: false })
        .limit(50),
      supabase
        .from("reviewee_activity_stats")
        .select(`
          total_sessions,
          completed_sessions,
          review_streak_days,
          total_correct_answers,
          total_answered_items,
          total_study_seconds,
          updated_at
        `)
        .maybeSingle(),
    ]);

    if (historyResult.error) {
      throw new Error(historyResult.error.message);
    }

    if (statsResult.error) {
      throw new Error(statsResult.error.message);
    }

    return {
      success: true,
      history: (historyResult.data ?? []).map(mapActivityHistoryRow),
      overviewStats: mapActivityHistoryOverviewStats(statsResult.data),
    };
  } catch (error: unknown) {
    return {
      success: false,
      history: [],
      overviewStats: emptyActivityHistoryOverviewStats,
      error: getActivityHistoryError(error, "Unable to load activity history"),
    };
  }
};
