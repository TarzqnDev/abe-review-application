export const DUPLICATE_SUBJECT_NAME_ERROR =
  "A subject with this name already exists in this area";

export const formatSubjectName = (subjectName: string) =>
  subjectName.trim().replace(/\s+/g, " ");

export const normalizeSubjectName = (subjectName: string) =>
  formatSubjectName(subjectName).toLowerCase();
