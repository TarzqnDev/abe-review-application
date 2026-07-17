export type PreparedFlashCardPrompt = {
  sessionFlashCardId: number;
  cardOrder: number;
  questionText: string;
};

export type PreparedFlashCardSession = {
  sessionId: string;
  areaId: number;
  areaName: string;
  timerSeconds: number;
  totalFlashCards: number;
  flashCards: PreparedFlashCardPrompt[];
};

export type FlashCardTiming = {
  sessionId: string;
  sessionFlashCardId: number;
  cardOrder: number;
  status: "active";
  serverNow: string;
  deadlineAt: string;
};

export type FlashCardAnswerSubmission = {
  sessionFlashCardId: number;
  status: "submitted";
  submittedAt: string;
  revealAt: string;
};

export type FlashCardAnswerReveal = {
  sessionFlashCardId: number;
  status: "answered";
  result: "correct" | "incorrect";
  isCorrect: boolean;
  correctAnswer: string;
  resolvedAt: string;
};

export type FlashCardTimeout = {
  sessionFlashCardId: number;
  status: "timed_out";
  result: "unanswered";
  resolvedAt: string;
};

export type FlashCardSummary = {
  sessionId: string;
  status: "completed" | "exited";
  endReason: "completed" | "user_exit";
  areaId: number | null;
  areaName: string;
  gameType: "Flash Cards";
  difficulty: null;
  totalQuestions: number;
  correct: number;
  incorrect: number;
  timedOut: number;
  notPlayed: number;
  questionsReached: number;
  answered: number;
  accuracyPercentage: number;
  completionPercentage: number;
  durationSeconds: number;
};

export type FlashCardAdvancement = {
  completed: boolean;
  timing: FlashCardTiming | null;
  summary: FlashCardSummary | null;
};

export type FlashCardCancellation = {
  sessionId: string;
  status: "cancelled";
};
