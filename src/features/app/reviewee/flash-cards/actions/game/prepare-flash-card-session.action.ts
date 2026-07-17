"use server";

import type { PreparedFlashCardSession } from "@/features/app/reviewee/flash-cards/types/flashCardGame";
import { createRevieweeFlashCardGameActionClient } from "@/features/app/reviewee/flash-cards/utils/game/createRevieweeFlashCardGameActionClient";
import {
  assertPositiveInteger,
  getFlashCardGameActionError,
} from "@/features/app/reviewee/flash-cards/utils/game/validateFlashCardGameActionInput";

export type PrepareFlashCardSessionInput = {
  areaId: number;
};

type PrepareFlashCardSessionPayload =
  | ({ status: "prepared" } & PreparedFlashCardSession)
  | { status: "empty" };

export const prepareFlashCardSession = async ({
  areaId,
}: PrepareFlashCardSessionInput) => {
  try {
    assertPositiveInteger(areaId, "subject area");

    const supabase = await createRevieweeFlashCardGameActionClient();
    const { data, error } = await supabase.rpc("prepare_flash_card_session", {
      selected_area_id: areaId,
    });

    if (error) {
      throw new Error(error.message);
    }

    const payload = data as unknown as PrepareFlashCardSessionPayload | null;

    if (!payload) {
      throw new Error("Unable to prepare the flash card game");
    }

    if (payload.status === "empty") {
      return {
        success: true,
        preparedSession: null,
        noFlashCards: true,
      };
    }

    const preparedSession: PreparedFlashCardSession = {
      sessionId: payload.sessionId,
      areaId: payload.areaId,
      areaName: payload.areaName,
      timerSeconds: payload.timerSeconds,
      totalFlashCards: payload.totalFlashCards,
      flashCards: payload.flashCards,
    };

    return {
      success: true,
      preparedSession,
    };
  } catch (error: unknown) {
    return {
      success: false,
      preparedSession: null,
      error: getFlashCardGameActionError(
        error,
        "Unable to prepare the flash card game",
      ),
    };
  }
};
