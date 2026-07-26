export type ActivityHistorySessionType = "mcq_quiz" | "flash_cards";

export type ActivityHistoryStatus = "completed" | "exited" | "cancelled";

export type ActivityHistoryEndReason =
  | "completed"
  | "user_exit"
  | "countdown_cancelled";

export type ActivityHistoryDifficulty = "Easy" | "Medium" | "Hard";

export type ActivityHistoryEntry = {
  id: string;
  sessionType: ActivityHistorySessionType;
  areaId: number | null;
  areaName: string;
  gameType: string;
  difficulty: ActivityHistoryDifficulty | null;
  status: ActivityHistoryStatus;
  endReason: ActivityHistoryEndReason;
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
  preparedAt: string;
  startedAt: string | null;
  terminalAt: string;
};

export type ActivityHistoryOption = {
  id: number;
  text: string;
  sortOrder: number;
};

type ActivityHistoryItemBase = {
  id: number;
  order: number;
  prompt: string;
  status: string;
  result: "correct" | "incorrect" | "unanswered" | null;
  presentedAt: string | null;
  deadlineAt: string | null;
  submittedAt: string | null;
  revealAt: string | null;
  resolvedAt: string | null;
  responseTimeMs: number | null;
};

export type ActivityHistoryMcqItem = ActivityHistoryItemBase & {
  sessionType: "mcq_quiz";
  subjectName: string;
  options: ActivityHistoryOption[];
  selectedOption: ActivityHistoryOption | null;
  correctOption: ActivityHistoryOption | null;
};

export type ActivityHistoryFlashCardItem = ActivityHistoryItemBase & {
  sessionType: "flash_cards";
  submittedAnswer: string | null;
  correctAnswer: string;
};

export type ActivityHistoryItem =
  | ActivityHistoryMcqItem
  | ActivityHistoryFlashCardItem;

export type ActivityHistoryDetails = {
  history: ActivityHistoryEntry;
  items: ActivityHistoryItem[];
};

export type FetchActivityHistoryResult =
  | { success: true; history: ActivityHistoryEntry[] }
  | { success: false; history: []; error: string };

export type FetchActivityHistoryDetailsResult =
  | { success: true; details: ActivityHistoryDetails }
  | { success: false; details: null; error: string };
