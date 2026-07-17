export const assertPositiveInteger = (value: number, fieldName: string) => {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`A valid ${fieldName} is required`);
  }
};

export const assertSessionId = (sessionId: string) => {
  if (!sessionId.trim()) {
    throw new Error("A valid flash card session is required");
  }
};

export const assertFlashCardAnswer = (answer: string) => {
  if (!answer.trim()) {
    throw new Error("An answer is required");
  }

  if (answer.length > 2000) {
    throw new Error("The answer must not exceed 2,000 characters");
  }
};

export const getFlashCardGameActionError = (
  error: unknown,
  fallbackMessage: string,
) => {
  console.error(error);
  return error instanceof Error ? error.message : fallbackMessage;
};
