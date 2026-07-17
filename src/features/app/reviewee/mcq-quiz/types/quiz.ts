export type QuizGameType =
  | "Guess the Word"
  | "AB-Solution"
  | "Situationship";

export type QuizDifficulty = "Easy" | "Medium" | "Hard";

export type QuizArea = {
  id: number;
  name: string;
};

export type PreparedQuizOption = {
  id: number;
  text: string;
  sortOrder: number;
};

export type PreparedQuizQuestion = {
  sessionQuestionId: number;
  questionOrder: number;
  subjectName: string;
  questionText: string;
  options: PreparedQuizOption[];
};

export type PreparedQuizSession = {
  sessionId: string;
  areaId: number;
  areaName: string;
  gameType: QuizGameType;
  difficulty: QuizDifficulty;
  timerSeconds: number;
  totalQuestions: number;
  questions: PreparedQuizQuestion[];
};

export type QuizQuestionTiming = {
  sessionId: string;
  sessionQuestionId: number;
  questionOrder: number;
  status: "active";
  serverNow: string;
  deadlineAt: string;
};

export type QuizAnswerSubmission = {
  sessionQuestionId: number;
  status: "submitted";
  submittedAt: string;
  revealAt: string;
};

export type QuizAnswerReveal = {
  sessionQuestionId: number;
  status: "answered";
  result: "correct" | "incorrect";
  isCorrect: boolean;
  correctOptionId: number;
  resolvedAt: string;
};

export type QuizQuestionTimeout = {
  sessionQuestionId: number;
  status: "timed_out";
  result: "unanswered";
  resolvedAt: string;
};

export type QuizSummary = {
  sessionId: string;
  status: "completed" | "exited";
  endReason: "completed" | "user_exit";
  areaId: number | null;
  areaName: string;
  gameType: QuizGameType;
  difficulty: QuizDifficulty;
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

export type QuizAdvancement = {
  completed: boolean;
  timing: QuizQuestionTiming | null;
  summary: QuizSummary | null;
};
