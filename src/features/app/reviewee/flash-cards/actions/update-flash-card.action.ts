"use server";

import { revalidatePath } from "next/cache";
import type {
  FlashCardMutationResult,
  UpdateFlashCardInput,
} from "@/features/app/reviewee/flash-cards/types/flashCard";
import { createRevieweeFlashCardActionClient } from "@/features/app/reviewee/flash-cards/utils/createRevieweeFlashCardActionClient";
import { mapFlashCardRow } from "@/features/app/reviewee/flash-cards/utils/mapFlashCardRow";
import {
  getFlashCardActionError,
  validateUpdateFlashCardInput,
} from "@/features/app/reviewee/flash-cards/utils/validateFlashCardActionInput";

export const updateFlashCard = async (
  input: UpdateFlashCardInput,
): Promise<FlashCardMutationResult> => {
  try {
    const validatedInput = validateUpdateFlashCardInput(input);
    const { supabase } = await createRevieweeFlashCardActionClient();
    const { data: flashCard, error } = await supabase
      .from("flash_cards")
      .update({
        question: validatedInput.question,
        answer: validatedInput.answer,
      })
      .eq("id", validatedInput.cardId)
      .select("id, deck_id, question, answer, created_at, updated_at")
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!flashCard) {
      throw new Error("Flash card was not found");
    }

    revalidatePath("/reviewee/flash-cards");

    return {
      success: true,
      message: "Flash card updated successfully",
      card: mapFlashCardRow(flashCard),
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "Unable to update flash card",
      error: getFlashCardActionError(error, "Unable to update flash card"),
      card: null,
    };
  }
};
