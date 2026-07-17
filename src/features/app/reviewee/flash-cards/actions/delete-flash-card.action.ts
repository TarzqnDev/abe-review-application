"use server";

import { revalidatePath } from "next/cache";
import type {
  DeleteFlashCardInput,
  DeleteFlashCardResult,
} from "@/features/app/reviewee/flash-cards/types/flashCard";
import { createRevieweeFlashCardActionClient } from "@/features/app/reviewee/flash-cards/utils/createRevieweeFlashCardActionClient";
import {
  assertPositiveInteger,
  getFlashCardActionError,
} from "@/features/app/reviewee/flash-cards/utils/validateFlashCardActionInput";

export const deleteFlashCard = async ({
  cardId,
}: DeleteFlashCardInput): Promise<DeleteFlashCardResult> => {
  try {
    assertPositiveInteger(cardId, "flash card");
    const { supabase } = await createRevieweeFlashCardActionClient();
    const { data: deletedCard, error } = await supabase
      .from("flash_cards")
      .delete()
      .eq("id", cardId)
      .select("id")
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!deletedCard) {
      throw new Error("Flash card was not found");
    }

    revalidatePath("/reviewee/flash-cards");

    return {
      success: true,
      message: "Flash card deleted successfully",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "Unable to delete flash card",
      error: getFlashCardActionError(error, "Unable to delete flash card"),
    };
  }
};
