"use server";

import type { FlashCardAnswerReveal } from "@/features/app/reviewee/flash-cards/types/flashCardGame";
import { createRevieweeFlashCardGameActionClient } from "@/features/app/reviewee/flash-cards/utils/game/createRevieweeFlashCardGameActionClient";
import {
  assertPositiveInteger,
  getFlashCardGameActionError,
} from "@/features/app/reviewee/flash-cards/utils/game/validateFlashCardGameActionInput";

export type RevealFlashCardAnswerInput = {
  sessionFlashCardId: number;
};

export const revealFlashCardAnswer = async ({
  sessionFlashCardId,
}: RevealFlashCardAnswerInput) => {
  try {
    assertPositiveInteger(sessionFlashCardId, "flash card");

    const supabase = await createRevieweeFlashCardGameActionClient();
    const { data, error } = await supabase.rpc("reveal_flash_card_answer", {
      selected_session_flash_card_id: sessionFlashCardId,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      answer: data as unknown as FlashCardAnswerReveal,
    };
  } catch (error: unknown) {
    return {
      success: false,
      answer: null,
      error: getFlashCardGameActionError(error, "Unable to reveal the answer"),
    };
  }
};
