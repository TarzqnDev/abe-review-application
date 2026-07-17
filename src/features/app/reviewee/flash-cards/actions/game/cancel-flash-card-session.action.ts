"use server";

import type { FlashCardCancellation } from "@/features/app/reviewee/flash-cards/types/flashCardGame";
import { createRevieweeFlashCardGameActionClient } from "@/features/app/reviewee/flash-cards/utils/game/createRevieweeFlashCardGameActionClient";
import {
  assertSessionId,
  getFlashCardGameActionError,
} from "@/features/app/reviewee/flash-cards/utils/game/validateFlashCardGameActionInput";

export type CancelFlashCardSessionInput = {
  sessionId: string;
};

export const cancelFlashCardSession = async ({
  sessionId,
}: CancelFlashCardSessionInput) => {
  try {
    assertSessionId(sessionId);

    const supabase = await createRevieweeFlashCardGameActionClient();
    const { data, error } = await supabase.rpc("cancel_flash_card_session", {
      selected_session_id: sessionId,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      cancellation: data as unknown as FlashCardCancellation,
    };
  } catch (error: unknown) {
    return {
      success: false,
      cancellation: null,
      error: getFlashCardGameActionError(
        error,
        "Unable to cancel the flash card game",
      ),
    };
  }
};
