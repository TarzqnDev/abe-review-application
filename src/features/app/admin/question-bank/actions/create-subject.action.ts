"use server";

import { revalidatePath } from "next/cache";
import { getTokenRoles } from "@/lib/auth/get-token-roles";
import { createActiveSupabaseServerActionClient } from "@/lib/supabase/server-action";
import { PAES_AREA_NAME } from "@/features/app/admin/question-bank/constants/questionBank";
import { assertSubjectNameIsAvailable } from "@/features/app/admin/question-bank/utils/assertSubjectNameIsAvailable";
import {
  DUPLICATE_SUBJECT_NAME_ERROR,
  formatSubjectName,
} from "@/features/app/admin/question-bank/utils/subjectName";

const validateSubjectName = (subjectName: string) => {
  if (!subjectName) return "Subject name is required";
  if (subjectName.length > 255) {
    return "Subject name must not exceed 255 characters";
  }

  return null;
};

export const createSubject = async (formData: FormData) => {
  try {
    const areaId = Number(formData.get("areaId"));
    const subjectName = formatSubjectName(
      String(formData.get("subjectName") ?? ""),
    );

    if (!Number.isInteger(areaId) || areaId <= 0) {
      throw new Error("A valid subject area is required");
    }

    const validationError = validateSubjectName(subjectName);

    if (validationError) {
      throw new Error(validationError);
    }

    const supabase = await createActiveSupabaseServerActionClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("You must be logged in to create a subject");
    }

    const roles = getTokenRoles(session);

    if (!roles.includes("admin")) {
      throw new Error("You are not authorized to create subjects");
    }

    const { data: subjectArea, error: subjectAreaError } = await supabase
      .from("subject_areas")
      .select("name")
      .eq("id", areaId)
      .single();

    if (subjectAreaError) {
      throw new Error(subjectAreaError.message);
    }

    if (subjectArea.name === PAES_AREA_NAME) {
      throw new Error("PAES Series subjects are predefined");
    }

    await assertSubjectNameIsAvailable(supabase, {
      areaId,
      subjectName,
    });

    const { error } = await supabase.from("subjects").insert({
      area_id: areaId,
      name: subjectName,
    });

    if (error) {
      if (error.code === "23505") {
        throw new Error(DUPLICATE_SUBJECT_NAME_ERROR);
      }

      throw new Error(error.message);
    }

    revalidatePath("/admin/question-bank");

    return {
      success: true,
      message: "Subject added successfully",
    };
  } catch (error: unknown) {
    console.error(error);

    return {
      success: false,
      message: "Unable to add subject",
      error: error instanceof Error ? error.message : "Unable to add subject",
    };
  }
};
