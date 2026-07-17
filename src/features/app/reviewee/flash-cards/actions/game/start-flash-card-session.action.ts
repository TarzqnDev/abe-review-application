"use server";

import type { FlashCardTiming } from "@/features/app/reviewee/flash-cards/types/flashCardGame";
import { createRevieweeFlashCardGameActionClient } from "@/features/app/reviewee/flash-cards/utils/game/createRevieweeFlashCardGameActionClient";
import {
  assertSessionId,
  getFlashCardGameActionError,
} from "@/features/app/reviewee/flash-cards/utils/game/validateFlashCardGameActionInput";

export type StartFlashCardSessionInput = {
  sessionId: string;
};

export const startFlashCardSession = async ({
  sessionId,
}: StartFlashCardSessionInput) => {
  try {
    assertSessionId(sessionId);

    const supabase = await createRevieweeFlashCardGameActionClient();
    const { data, error } = await supabase.rpc("start_flash_card_session", {
      selected_session_id: sessionId,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      timing: data as unknown as FlashCardTiming,
    };
  } catch (error: unknown) {
    return {
      success: false,
      timing: null,
      error: getFlashCardGameActionError(
        error,
        "Unable to start the flash card game",
      ),
    };
  }
};
