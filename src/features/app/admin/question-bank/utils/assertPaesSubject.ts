import { PAES_AREA_NAME } from "@/features/app/admin/question-bank/constants/questionBank";

type AdminQuestionBankClient = Awaited<
  ReturnType<
    typeof import("@/features/app/admin/question-bank/utils/assertAdminSession").createAdminSubjectActionClient
  >
>;

type SubjectAreaReference = {
  name: string;
};

type PaesSubjectLookup = {
  id: number;
  subject_areas: SubjectAreaReference | SubjectAreaReference[] | null;
};

export const assertPaesSubject = async (
  supabase: AdminQuestionBankClient,
  subjectId: number,
) => {
  const { data, error } = await supabase
    .from("subjects")
    .select("id, subject_areas!inner(name)")
    .eq("id", subjectId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const subject = data as PaesSubjectLookup;
  const subjectArea = Array.isArray(subject.subject_areas)
    ? subject.subject_areas[0]
    : subject.subject_areas;

  if (subjectArea?.name !== PAES_AREA_NAME) {
    throw new Error("The selected subject does not belong to PAES Series");
  }
};

export const assertStandardQuestionBankSubject = async (
  supabase: AdminQuestionBankClient,
  subjectId: number,
) => {
  const { data, error } = await supabase
    .from("subjects")
    .select("id, subject_areas!inner(name)")
    .eq("id", subjectId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const subject = data as PaesSubjectLookup;
  const subjectArea = Array.isArray(subject.subject_areas)
    ? subject.subject_areas[0]
    : subject.subject_areas;

  if (subjectArea?.name === PAES_AREA_NAME) {
    throw new Error("PAES questions must use the PAES question form");
  }
};
