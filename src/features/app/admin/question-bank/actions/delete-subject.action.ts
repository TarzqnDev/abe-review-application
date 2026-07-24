"use server";

import { revalidatePath } from "next/cache";
import { createAdminSubjectActionClient } from "@/features/app/admin/question-bank/utils/assertAdminSession";

type DeleteSubjectInput = {
  areaId: number;
  subjectId: number;
};

export const deleteSubject = async ({
  areaId,
  subjectId,
}: DeleteSubjectInput) => {
  try {
    if (!Number.isInteger(subjectId) || subjectId <= 0) {
      throw new Error("A valid subject is required");
    }

    if (!Number.isInteger(areaId) || areaId <= 0) {
      throw new Error("A valid subject area is required");
    }

    const supabase = await createAdminSubjectActionClient();
    const { data: deletedSubject, error } = await supabase
      .from("subjects")
      .delete()
      .eq("id", subjectId)
      .eq("area_id", areaId)
      .select("id")
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!deletedSubject) {
      throw new Error("Subject was not found in the selected area");
    }

    revalidatePath("/admin/question-bank");

    return {
      success: true,
      message: "Subject deleted successfully",
    };
  } catch (error: unknown) {
    console.error(error);

    return {
      success: false,
      message: "Unable to delete subject",
      error:
        error instanceof Error ? error.message : "Unable to delete subject",
    };
  }
};
