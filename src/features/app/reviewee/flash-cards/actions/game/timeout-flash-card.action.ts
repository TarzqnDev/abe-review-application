"use server";

import type { FlashCardTimeout } from "@/features/app/reviewee/flash-cards/types/flashCardGame";
import { createRevieweeFlashCardGameActionClient } from "@/features/app/reviewee/flash-cards/utils/game/createRevieweeFlashCardGameActionClient";
import {
  assertPositiveInteger,
  getFlashCardGameActionError,
} from "@/features/app/reviewee/flash-cards/utils/game/validateFlashCardGameActionInput";

export type TimeoutFlashCardInput = {
  sessionFlashCardId: number;
};

export const timeoutFlashCard = async ({
  sessionFlashCardId,
}: TimeoutFlashCardInput) => {
  try {
    assertPositiveInteger(sessionFlashCardId, "flash card");

    const supabase = await createRevieweeFlashCardGameActionClient();
    const { data, error } = await supabase.rpc("timeout_flash_card", {
      selected_session_flash_card_id: sessionFlashCardId,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      timeout: data as unknown as FlashCardTimeout,
    };
  } catch (error: unknown) {
    return {
      success: false,
      timeout: null,
      error: getFlashCardGameActionError(
        error,
        "Unable to finish the flash card",
      ),
    };
  }
};
