"use server";

import { revalidatePath } from "next/cache";
import { createAdminTriviaActionClient } from "@/features/app/admin/trivias/utils/assertAdminSession";
import {
  assertPublishDateIsNotPast,
  validateTrivia,
} from "@/features/app/admin/trivias/utils/validateTrivia";

type UpdateTriviaInput = {
  content: string;
  publishDate: string;
  triviaId: number;
};

export const updateTrivia = async ({
  content,
  publishDate,
  triviaId,
}: UpdateTriviaInput) => {
  try {
    if (!Number.isInteger(triviaId) || triviaId <= 0) {
      throw new Error("A valid trivia is required");
    }

    const validatedTrivia = validateTrivia(content, publishDate);
    const supabase = await createAdminTriviaActionClient();
    const { data: existingTrivia, error: lookupError } = await supabase
      .from("trivias")
      .select("publish_date")
      .eq("id", triviaId)
      .maybeSingle();

    if (lookupError) {
      throw new Error(lookupError.message);
    }

    if (!existingTrivia) {
      throw new Error("Trivia was not found");
    }

    if (validatedTrivia.publishDate !== existingTrivia.publish_date) {
      assertPublishDateIsNotPast(validatedTrivia.publishDate);
    }

    const { data: updatedTrivia, error } = await supabase
      .from("trivias")
      .update({
        content: validatedTrivia.content,
        publish_date: validatedTrivia.publishDate,
      })
      .eq("id", triviaId)
      .select("id")
      .maybeSingle();

    if (error?.code === "23505") {
      throw new Error("A trivia is already scheduled for this publish date");
    }

    if (error) {
      throw new Error(error.message);
    }

    if (!updatedTrivia) {
      throw new Error("Trivia was not found");
    }

    revalidatePath("/admin/trivias");

    return {
      success: true,
      message: "Trivia updated successfully",
    };
  } catch (error: unknown) {
    console.error(error);

    return {
      success: false,
      message: "Unable to update trivia",
      error: error instanceof Error ? error.message : "Unable to update trivia",
    };
  }
};
