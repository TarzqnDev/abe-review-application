"use server";

import { getTokenRoles } from "@/lib/auth/get-token-roles";
import { createActiveSupabaseServerActionClient } from "@/lib/supabase/server-action";
import { PAES_AREA_NAME } from "@/features/app/admin/question-bank/constants/questionBank";

const validateSubjectAreaName = (subjectAreaName: string) => {
  if (!subjectAreaName) return "Area name is required";
  if (subjectAreaName.length > 255) {
    return "Area name must not exceed 255 characters";
  }

  return null;
};

export const updateSubjectArea = async (formData: FormData) => {
  try {
    const areaId = Number(formData.get("areaId"));
    const areaName = String(formData.get("areaName") ?? "").trim();

    if (!Number.isInteger(areaId) || areaId <= 0) {
      throw new Error("A valid subject area is required");
    }

    const validationError = validateSubjectAreaName(areaName);

    if (validationError) {
      throw new Error(validationError);
    }

    const supabase = await createActiveSupabaseServerActionClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("You must be logged in to update a subject area");
    }

    const roles = getTokenRoles(session);

    if (!roles.includes("admin")) {
      throw new Error("You are not authorized to update subject areas");
    }

    const { data: subjectArea, error: subjectAreaLookupError } = await supabase
      .from("subject_areas")
      .select("name")
      .eq("id", areaId)
      .single();

    if (subjectAreaLookupError) {
      throw new Error(subjectAreaLookupError.message);
    }

    if (subjectArea.name === PAES_AREA_NAME) {
      throw new Error("PAES Series cannot be edited");
    }

    const { error } = await supabase
      .from("subject_areas")
      .update({
        name: areaName,
      })
      .eq("id", areaId);

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      message: "Area updated successfully",
    };
  } catch (error: unknown) {
    console.error(error);

    return {
      success: false,
      message: "Unable to update area",
      error: error instanceof Error ? error.message : "Unable to update area",
    };
  }
};
