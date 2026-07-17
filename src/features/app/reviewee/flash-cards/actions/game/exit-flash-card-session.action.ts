"use server";

import type { FlashCardSummary } from "@/features/app/reviewee/flash-cards/types/flashCardGame";
import { createRevieweeFlashCardGameActionClient } from "@/features/app/reviewee/flash-cards/utils/game/createRevieweeFlashCardGameActionClient";
import {
  assertSessionId,
  getFlashCardGameActionError,
} from "@/features/app/reviewee/flash-cards/utils/game/validateFlashCardGameActionInput";

export type ExitFlashCardSessionInput = {
  sessionId: string;
};

export const exitFlashCardSession = async ({
  sessionId,
}: ExitFlashCardSessionInput) => {
  try {
    assertSessionId(sessionId);

    const supabase = await createRevieweeFlashCardGameActionClient();
    const { data, error } = await supabase.rpc("exit_flash_card_session", {
      selected_session_id: sessionId,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      summary: data as unknown as FlashCardSummary,
    };
  } catch (error: unknown) {
    return {
      success: false,
      summary: null,
      error: getFlashCardGameActionError(
        error,
        "Unable to exit the flash card game",
      ),
    };
  }
};
