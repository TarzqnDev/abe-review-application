"use server";

import type { FlashCardAdvancement } from "@/features/app/reviewee/flash-cards/types/flashCardGame";
import { createRevieweeFlashCardGameActionClient } from "@/features/app/reviewee/flash-cards/utils/game/createRevieweeFlashCardGameActionClient";
import {
  assertSessionId,
  getFlashCardGameActionError,
} from "@/features/app/reviewee/flash-cards/utils/game/validateFlashCardGameActionInput";

export type AdvanceFlashCardSessionInput = {
  sessionId: string;
};

export const advanceFlashCardSession = async ({
  sessionId,
}: AdvanceFlashCardSessionInput) => {
  try {
    assertSessionId(sessionId);

    const supabase = await createRevieweeFlashCardGameActionClient();
    const { data, error } = await supabase.rpc("advance_flash_card_session", {
      selected_session_id: sessionId,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      advancement: data as unknown as FlashCardAdvancement,
    };
  } catch (error: unknown) {
    return {
      success: false,
      advancement: null,
      error: getFlashCardGameActionError(
        error,
        "Unable to continue the flash card game",
      ),
    };
  }
};
