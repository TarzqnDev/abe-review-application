"use server";

import { revalidatePath } from "next/cache";
import { createAdminSubjectActionClient } from "@/features/app/admin/question-bank/utils/assertAdminSession";
import { PAES_AREA_NAME } from "@/features/app/admin/question-bank/constants/questionBank";

const validateSubjectName = (subjectName: string) => {
  if (!subjectName) return "Subject name is required";
  if (subjectName.length > 255) {
    return "Subject name must not exceed 255 characters";
  }

  return null;
};

export const updateSubject = async (formData: FormData) => {
  try {
    const subjectId = Number(formData.get("subjectId"));
    const areaId = Number(formData.get("areaId"));
    const subjectName = String(formData.get("subjectName") ?? "").trim();

    if (!Number.isInteger(subjectId) || subjectId <= 0) {
      throw new Error("A valid subject is required");
    }

    if (!Number.isInteger(areaId) || areaId <= 0) {
      throw new Error("A valid subject area is required");
    }

    const validationError = validateSubjectName(subjectName);

    if (validationError) {
      throw new Error(validationError);
    }

    const supabase = await createAdminSubjectActionClient();
    const { data: subjectArea, error: subjectAreaError } = await supabase
      .from("subject_areas")
      .select("name")
      .eq("id", areaId)
      .single();

    if (subjectAreaError) {
      throw new Error(subjectAreaError.message);
    }

    if (subjectArea.name === PAES_AREA_NAME) {
      throw new Error("PAES Series subjects cannot be edited");
    }

    const { data: updatedSubject, error } = await supabase
      .from("subjects")
      .update({ name: subjectName })
      .eq("id", subjectId)
      .eq("area_id", areaId)
      .select("id")
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!updatedSubject) {
      throw new Error("Subject was not found in the selected area");
    }

    revalidatePath("/admin/question-bank");

    return {
      success: true,
      message: "Subject updated successfully",
    };
  } catch (error: unknown) {
    console.error(error);

    return {
      success: false,
      message: "Unable to update subject",
      error:
        error instanceof Error ? error.message : "Unable to update subject",
    };
  }
};
