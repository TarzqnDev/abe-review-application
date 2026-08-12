import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import {
  DUPLICATE_SUBJECT_NAME_ERROR,
  normalizeSubjectName,
} from "@/features/app/admin/question-bank/utils/subjectName";

type AssertSubjectNameIsAvailableInput = {
  areaId: number;
  excludedSubjectId?: number;
  subjectName: string;
};

export const assertSubjectNameIsAvailable = async (
  supabase: SupabaseClient<Database>,
  {
    areaId,
    excludedSubjectId,
    subjectName,
  }: AssertSubjectNameIsAvailableInput,
) => {
  const { data: subjects, error } = await supabase
    .from("subjects")
    .select("id, name")
    .eq("area_id", areaId);

  if (error) {
    throw new Error(error.message);
  }

  const normalizedSubjectName = normalizeSubjectName(subjectName);
  const subjectAlreadyExists = (subjects ?? []).some(
    (existingSubject) =>
      existingSubject.id !== excludedSubjectId &&
      normalizeSubjectName(existingSubject.name) === normalizedSubjectName,
  );

  if (subjectAlreadyExists) {
    throw new Error(DUPLICATE_SUBJECT_NAME_ERROR);
  }
};
