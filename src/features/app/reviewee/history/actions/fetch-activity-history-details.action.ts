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
  historyId: number;
};

export const fetchActivityHistoryDetails = async ({
  historyId,
}: FetchActivityHistoryDetailsInput): Promise<FetchActivityHistoryDetailsResult> => {
  try {
    if (!Number.isSafeInteger(historyId) || historyId <= 0) {
      throw new Error("A valid activity history entry is required");
    }

    const supabase = await createRevieweeHistoryActionClient();
    const [historyResult, detailsResult] = await Promise.all([
      supabase.from("activity_history").select("*").eq("id", historyId).single(),
      supabase.rpc("get_activity_history_details", {
        selected_history_id: historyId,
      }),
    ]);

    if (historyResult.error) {
      throw new Error(historyResult.error.message);
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
        historyResult.data,
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
