import type {
  QuizDifficulty,
  QuizGameType,
} from "@/features/app/reviewee/mcq-quiz/types/quiz";

const QUIZ_GAME_TYPES: QuizGameType[] = [
  "Guess the Word",
  "AB-Solution",
  "Situationship",
  "PAES",
];

const QUIZ_DIFFICULTIES: QuizDifficulty[] = ["Easy", "Medium", "Hard"];

export const isQuizGameType = (value: string): value is QuizGameType =>
  QUIZ_GAME_TYPES.some((gameType) => gameType === value);

export const isQuizDifficulty = (value: string): value is QuizDifficulty =>
  QUIZ_DIFFICULTIES.some((difficulty) => difficulty === value);

export const assertPositiveInteger = (value: number, fieldName: string) => {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`A valid ${fieldName} is required`);
  }
};

export const assertSessionId = (sessionId: string) => {
  if (!sessionId.trim()) {
    throw new Error("A valid quiz session is required");
  }
};

export const assertIsoDateTime = (value: string, fieldName: string) => {
  if (!value.trim() || Number.isNaN(Date.parse(value))) {
    throw new Error(`A valid ${fieldName} is required`);
  }
};

export const getQuizActionError = (
  error: unknown,
  fallbackMessage: string,
) => {
  console.error(error);
  return error instanceof Error ? error.message : fallbackMessage;
};
