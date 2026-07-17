"use server";

import { revalidatePath } from "next/cache";
import type {
  CreateFlashCardInput,
  FlashCardMutationResult,
} from "@/features/app/reviewee/flash-cards/types/flashCard";
import { createRevieweeFlashCardActionClient } from "@/features/app/reviewee/flash-cards/utils/createRevieweeFlashCardActionClient";
import { mapFlashCardRow } from "@/features/app/reviewee/flash-cards/utils/mapFlashCardRow";
import {
  getFlashCardActionError,
  validateCreateFlashCardInput,
} from "@/features/app/reviewee/flash-cards/utils/validateFlashCardActionInput";

export const createFlashCard = async (
  input: CreateFlashCardInput,
): Promise<FlashCardMutationResult> => {
  try {
    const validatedInput = validateCreateFlashCardInput(input);
    const { supabase, user } = await createRevieweeFlashCardActionClient();
    const { data: selectedArea, error: selectedAreaError } = await supabase
      .from("subject_areas")
      .select("id")
      .eq("id", validatedInput.areaId)
      .maybeSingle();

    if (selectedAreaError) {
      throw new Error(selectedAreaError.message);
    }

    if (!selectedArea) {
      throw new Error("A valid subject area is required");
    }

    const { data: deck, error: deckError } = await supabase
      .from("flash_card_decks")
      .upsert(
        {
          area_id: validatedInput.areaId,
          user_id: user.id,
        },
        { onConflict: "user_id,area_id" },
      )
      .select("id")
      .single();

    if (deckError) {
      throw new Error(deckError.message);
    }

    const { data: flashCard, error: flashCardError } = await supabase
      .from("flash_cards")
      .insert({
        deck_id: deck.id,
        question: validatedInput.question,
        answer: validatedInput.answer,
      })
      .select("id, deck_id, question, answer, created_at, updated_at")
      .single();

    if (flashCardError) {
      throw new Error(flashCardError.message);
    }

    revalidatePath("/reviewee/flash-cards");

    return {
      success: true,
      message: "Flash card added successfully",
      card: mapFlashCardRow(flashCard),
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "Unable to add flash card",
      error: getFlashCardActionError(error, "Unable to add flash card"),
      card: null,
    };
  }
};
