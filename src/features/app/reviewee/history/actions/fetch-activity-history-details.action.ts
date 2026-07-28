"use server";

import type {
  ActivityHistoryDetails,
  FetchActivityHistoryDetailsResult,
} from "@/features/app/reviewee/history/types/activityHistory";
import {
  getActivityHistoryError,
  mapActivityHistoryDetails,
} from "@/features/app/reviewee/history/utils/activityHistoryMappers";
import { createRevieweeHistoryActionClient } from "@/features/app/reviewee/history/utils/createRevieweeHistoryActionClient";

export type FetchActivityHistoryDetailsInput = {
  sessionId: string;
};

export const fetchActivityHistoryDetails = async ({
  sessionId,
}: FetchActivityHistoryDetailsInput): Promise<FetchActivityHistoryDetailsResult> => {
  try {
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        sessionId,
      )
    ) {
      throw new Error("A valid activity history entry is required");
    }

    const supabase = await createRevieweeHistoryActionClient();
    const [sessionResult, detailsResult] = await Promise.all([
      supabase
        .from("game_sessions")
        .select(`
          *,
          game_session_flash_cards(status, result),
          game_session_questions(status, result)
        `)
        .eq("id", sessionId)
        .in("status", ["completed", "exited"])
        .single(),
      supabase.rpc("get_activity_history_details", {
        selected_session_id: sessionId,
      }),
    ]);

    if (sessionResult.error) {
      throw new Error(sessionResult.error.message);
    }

    if (detailsResult.error) {
      throw new Error(detailsResult.error.message);
    }

    if (!detailsResult.data || typeof detailsResult.data !== "object") {
      throw new Error("Activity history details were not found");
    }

    return {
      success: true,
      details: mapActivityHistoryDetails(
        sessionResult.data,
        detailsResult.data as unknown as Parameters<
          typeof mapActivityHistoryDetails
        >[1],
      ) satisfies ActivityHistoryDetails,
    };
  } catch (error: unknown) {
    return {
      success: false,
      details: null,
      error: getActivityHistoryError(
        error,
        "Unable to load activity history details",
      ),
    };
  }
};
