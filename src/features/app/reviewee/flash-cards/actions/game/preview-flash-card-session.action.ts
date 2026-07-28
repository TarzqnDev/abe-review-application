"use server";

import type { FlashCardCountdownDetails } from "@/features/app/reviewee/flash-cards/types/flashCardGame";
import { createRevieweeFlashCardGameActionClient } from "@/features/app/reviewee/flash-cards/utils/game/createRevieweeFlashCardGameActionClient";
import {
  assertPositiveInteger,
  getFlashCardGameActionError,
} from "@/features/app/reviewee/flash-cards/utils/game/validateFlashCardGameActionInput";

export type PreviewFlashCardSessionInput = {
  areaId: number;
};

type PreviewFlashCardSessionPayload =
  | ({ status: "available" } & FlashCardCountdownDetails)
  | { status: "empty" };

export const previewFlashCardSession = async ({
  areaId,
}: PreviewFlashCardSessionInput) => {
  try {
    assertPositiveInteger(areaId, "subject area");

    const supabase = await createRevieweeFlashCardGameActionClient();
    const { data, error } = await supabase.rpc("preview_flash_card_session", {
      selected_area_id: areaId,
    });

    if (error) {
      throw new Error(error.message);
    }

    const payload = data as unknown as PreviewFlashCardSessionPayload | null;

    if (!payload) {
      throw new Error("Unable to preview the flash card game");
    }

    if (payload.status === "empty") {
      return {
        success: true,
        countdownDetails: null,
        noFlashCards: true,
      };
    }

    const countdownDetails: FlashCardCountdownDetails = {
      areaId: payload.areaId,
      areaName: payload.areaName,
      timerSeconds: payload.timerSeconds,
      totalFlashCards: payload.totalFlashCards,
    };

    return {
      success: true,
      countdownDetails,
      noFlashCards: false,
    };
  } catch (error: unknown) {
    return {
      success: false,
      countdownDetails: null,
      noFlashCards: false,
      error: getFlashCardGameActionError(
        error,
        "Unable to preview the flash card game",
      ),
    };
  }
};
