"use server";

import type { AdminTrivia } from "@/features/app/admin/trivias/types/adminTrivia";
import { createAdminTriviaActionClient } from "@/features/app/admin/trivias/utils/assertAdminSession";

export const fetchTrivias = async () => {
  try {
    const supabase = await createAdminTriviaActionClient();
    const { data, error } = await supabase
      .from("trivias")
      .select("id, content, publish_date, created_at, updated_at")
      .order("publish_date", { ascending: true })
      .order("id", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    const trivias: AdminTrivia[] = (data ?? []).map((trivia) => ({
      content: trivia.content,
      createdAt: trivia.created_at,
      id: trivia.id,
      publishDate: trivia.publish_date,
      updatedAt: trivia.updated_at,
    }));

    return {
      success: true,
      trivias,
    };
  } catch (error: unknown) {
    console.error(error);

    return {
      success: false,
      trivias: [] as AdminTrivia[],
      error: error instanceof Error ? error.message : "Unable to fetch trivias",
    };
  }
};
