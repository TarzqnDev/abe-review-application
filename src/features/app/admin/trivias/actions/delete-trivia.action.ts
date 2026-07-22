"use server";

import { revalidatePath } from "next/cache";
import { createAdminTriviaActionClient } from "@/features/app/admin/trivias/utils/assertAdminSession";

type DeleteTriviaInput = {
  triviaId: number;
};

export const deleteTrivia = async ({ triviaId }: DeleteTriviaInput) => {
  try {
    if (!Number.isInteger(triviaId) || triviaId <= 0) {
      throw new Error("A valid trivia is required");
    }

    const supabase = await createAdminTriviaActionClient();
    const { data: deletedTrivia, error } = await supabase
      .from("trivias")
      .delete()
      .eq("id", triviaId)
      .select("id")
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!deletedTrivia) {
      throw new Error("Trivia was not found");
    }

    revalidatePath("/admin/trivias");

    return {
      success: true,
      message: "Trivia deleted successfully",
    };
  } catch (error: unknown) {
    console.error(error);

    return {
      success: false,
      message: "Unable to delete trivia",
      error: error instanceof Error ? error.message : "Unable to delete trivia",
    };
  }
};
