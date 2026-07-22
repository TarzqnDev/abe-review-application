"use server";

import { revalidatePath } from "next/cache";
import { createAdminTriviaActionClient } from "@/features/app/admin/trivias/utils/assertAdminSession";
import {
  assertPublishDateIsNotPast,
  validateTrivia,
} from "@/features/app/admin/trivias/utils/validateTrivia";

type CreateTriviaInput = {
  content: string;
  publishDate: string;
};

export const createTrivia = async ({
  content,
  publishDate,
}: CreateTriviaInput) => {
  try {
    const validatedTrivia = validateTrivia(content, publishDate);
    assertPublishDateIsNotPast(validatedTrivia.publishDate);

    const supabase = await createAdminTriviaActionClient();
    const { error } = await supabase.from("trivias").insert({
      content: validatedTrivia.content,
      publish_date: validatedTrivia.publishDate,
    });

    if (error?.code === "23505") {
      throw new Error("A trivia is already scheduled for this publish date");
    }

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/admin/trivias");

    return {
      success: true,
      message: "Trivia created successfully",
    };
  } catch (error: unknown) {
    console.error(error);

    return {
      success: false,
      message: "Unable to create trivia",
      error: error instanceof Error ? error.message : "Unable to create trivia",
    };
  }
};
