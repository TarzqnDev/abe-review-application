"use server";

import type { FlashCardAnswerSubmission } from "@/features/app/reviewee/flash-cards/types/flashCardGame";
import { createRevieweeFlashCardGameActionClient } from "@/features/app/reviewee/flash-cards/utils/game/createRevieweeFlashCardGameActionClient";
import {
  assertFlashCardAnswer,
  assertPositiveInteger,
  getFlashCardGameActionError,
} from "@/features/app/reviewee/flash-cards/utils/game/validateFlashCardGameActionInput";

export type SubmitFlashCardAnswerInput = {
  sessionFlashCardId: number;
  answer: string;
};

export const submitFlashCardAnswer = async ({
  sessionFlashCardId,
  answer,
}: SubmitFlashCardAnswerInput) => {
  try {
    assertPositiveInteger(sessionFlashCardId, "flash card");
    assertFlashCardAnswer(answer);

    const supabase = await createRevieweeFlashCardGameActionClient();
    const { data, error } = await supabase.rpc("submit_flash_card_answer", {
      selected_answer: answer,
      selected_session_flash_card_id: sessionFlashCardId,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      submission: data as unknown as FlashCardAnswerSubmission,
    };
  } catch (error: unknown) {
    return {
      success: false,
      submission: null,
      error: getFlashCardGameActionError(error, "Unable to submit the answer"),
    };
  }
};
