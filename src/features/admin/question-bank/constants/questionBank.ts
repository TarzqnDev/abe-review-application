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

export const QUESTION_BANK_GAME_TYPE_FIELDS = {
  "Guess the Word": [
    {
      label: "Hint",
      maxLength: 500,
      name: "hint",
      optional: true,
      rows: 3,
    },
  ],
  "AB-Solution": [
    {
      label: "Statement A",
      maxLength: 1000,
      name: "statementA",
      optional: false,
      rows: 3,
    },
    {
      label: "Statement B",
      maxLength: 1000,
      name: "statementB",
      optional: false,
      rows: 3,
    },
  ],
  Situationship: [
    {
      label: "Situation/Scenario",
      maxLength: 1000,
      name: "situation",
      optional: false,
      rows: 4,
    },
  ],
} as const satisfies Record<
  QuestionBankGameType,
  {
    label: string;
    maxLength: number;
    name: string;
    optional: boolean;
    rows: number;
  }[]
>;

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
