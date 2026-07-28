"use server";

import type {
  FlashCardTiming,
  PreparedFlashCardSession,
} from "@/features/app/reviewee/flash-cards/types/flashCardGame";
import { createRevieweeFlashCardGameActionClient } from "@/features/app/reviewee/flash-cards/utils/game/createRevieweeFlashCardGameActionClient";
import {
  assertPositiveInteger,
  getFlashCardGameActionError,
} from "@/features/app/reviewee/flash-cards/utils/game/validateFlashCardGameActionInput";

export type StartFlashCardSessionAfterCountdownInput = {
  areaId: number;
};

type StartFlashCardSessionAfterCountdownPayload =
  | {
      status: "started";
      preparedSession: PreparedFlashCardSession;
      timing: FlashCardTiming;
    }
  | { status: "empty" };

export const startFlashCardSessionAfterCountdown = async ({
  areaId,
}: StartFlashCardSessionAfterCountdownInput) => {
  try {
    assertPositiveInteger(areaId, "subject area");

    const supabase = await createRevieweeFlashCardGameActionClient();
    const { data, error } = await supabase.rpc(
      "start_flash_card_session_after_countdown",
      {
        selected_area_id: areaId,
      },
    );

    if (error) {
      throw new Error(error.message);
    }

    const payload =
      data as unknown as StartFlashCardSessionAfterCountdownPayload | null;

    if (!payload) {
      throw new Error("Unable to start the flash card game");
    }

    if (payload.status === "empty") {
      return {
        success: true,
        preparedSession: null,
        timing: null,
        noFlashCards: true,
      };
    }

    return {
      success: true,
      preparedSession: payload.preparedSession,
      timing: payload.timing,
      noFlashCards: false,
    };
  } catch (error: unknown) {
    return {
      success: false,
      preparedSession: null,
      timing: null,
      noFlashCards: false,
      error: getFlashCardGameActionError(
        error,
        "Unable to start the flash card game",
      ),
    };
  }
};
