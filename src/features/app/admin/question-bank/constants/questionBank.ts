export const QUESTION_BANK_GAME_TYPES = [
  "Guess the Word",
  "AB-Solution",
  "Situationship",
] as const;

export const QUESTION_BANK_DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

export type QuestionBankGameType = (typeof QUESTION_BANK_GAME_TYPES)[number];
export type QuestionBankDifficulty = (typeof QUESTION_BANK_DIFFICULTIES)[number];

export type QuestionBankSummary = {
  difficulty: QuestionBankDifficulty;
  gameType: QuestionBankGameType;
  questionSetId: number | null;
  questionCount: number;
};

export const QUESTION_BANK_OPTION_LABELS = ["A", "B", "C", "D"] as const;
export const PAES_AREA_NAME = "PAES Series";
export const PAES_GAME_TYPE = "PAES";

export const isPaesSubjectArea = (areaName: string) =>
  areaName.trim().toLocaleLowerCase() === PAES_AREA_NAME.toLocaleLowerCase();

export const createEmptyQuestionBankSummaries = (): QuestionBankSummary[] =>
  QUESTION_BANK_DIFFICULTIES.flatMap((difficulty) =>
    QUESTION_BANK_GAME_TYPES.map((gameType) => ({
      difficulty,
      gameType,
      questionSetId: null,
      questionCount: 0,
    })),
  );

export const isQuestionBankGameType = (
  gameType: string,
): gameType is QuestionBankGameType =>
  QUESTION_BANK_GAME_TYPES.some(
    (questionBankGameType) => questionBankGameType === gameType,
  );

export const isQuestionBankDifficulty = (
  difficulty: string,
): difficulty is QuestionBankDifficulty =>
  QUESTION_BANK_DIFFICULTIES.some(
    (questionBankDifficulty) => questionBankDifficulty === difficulty,
  );
