import type {
  ActivityHistoryDetails,
  ActivityHistoryEntry,
  ActivityHistoryItem,
} from "@/features/app/reviewee/history/types/activityHistory";
import type { Database } from "@/types/database.types";

type ActivityHistoryRow = Database["public"]["Tables"]["activity_history"]["Row"];

export const mapActivityHistoryRow = (
  history: ActivityHistoryRow,
): ActivityHistoryEntry => ({
  id: history.id,
  gameSessionId: history.game_session_id,
  sessionType: history.session_type as ActivityHistoryEntry["sessionType"],
  areaId: history.area_id,
  areaName: history.area_name,
  gameType: history.game_type,
  difficulty: history.difficulty as ActivityHistoryEntry["difficulty"],
  status: history.status as ActivityHistoryEntry["status"],
  endReason: history.end_reason as ActivityHistoryEntry["endReason"],
  totalQuestions: history.total_questions,
  correct: history.correct_count,
  incorrect: history.incorrect_count,
  timedOut: history.timed_out_count,
  notPlayed: history.not_played_count,
  questionsReached: history.questions_reached_count,
  answered: history.answered_count,
  accuracyPercentage: history.accuracy_percentage,
  completionPercentage: history.completion_percentage,
  durationSeconds: history.duration_seconds,
  preparedAt: history.prepared_at,
  startedAt: history.started_at,
  terminalAt: history.terminal_at,
  updatedAt: history.updated_at,
});

type ActivityHistoryDetailsPayload = {
  historyId: number;
  gameSessionId: string;
  sessionType: ActivityHistoryEntry["sessionType"];
  items: ActivityHistoryItem[];
};

export const mapActivityHistoryDetails = (
  history: ActivityHistoryRow,
  payload: ActivityHistoryDetailsPayload,
): ActivityHistoryDetails => {
  if (
    payload.historyId !== history.id ||
    payload.gameSessionId !== history.game_session_id ||
    payload.sessionType !== history.session_type ||
    !Array.isArray(payload.items)
  ) {
    throw new Error("Activity history details are invalid");
  }

  return {
    history: mapActivityHistoryRow(history),
    items: payload.items,
  };
};

export const getActivityHistoryError = (
  error: unknown,
  fallbackMessage: string,
) => (error instanceof Error ? error.message : fallbackMessage);
