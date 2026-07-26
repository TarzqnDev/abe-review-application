import type {
  ActivityHistoryDetails,
  ActivityHistoryEntry,
  ActivityHistoryItem,
} from "@/features/app/reviewee/history/types/activityHistory";
import type { Database } from "@/types/database.types";

type GameSessionRow = Database["public"]["Tables"]["game_sessions"]["Row"];
type GameSessionItemSummary = {
  result: string | null;
  status: string;
};

export type ActivityHistoryGameSessionRow = GameSessionRow & {
  game_session_flash_cards: GameSessionItemSummary[];
  game_session_questions: GameSessionItemSummary[];
};

const calculatePercentage = (value: number, total: number) =>
  total === 0 ? 0 : Math.round((value / total) * 10_000) / 100;

const calculateDurationSeconds = (
  startedAt: string | null,
  endedAt: string | null,
) => {
  if (!startedAt) return 0;

  return Math.max(
    0,
    Math.floor(
      (new Date(endedAt ?? startedAt).getTime() -
        new Date(startedAt).getTime()) /
        1000,
    ),
  );
};

export const mapActivityHistoryRow = (
  session: ActivityHistoryGameSessionRow,
): ActivityHistoryEntry => {
  const items =
    session.session_type === "flash_cards"
      ? session.game_session_flash_cards
      : session.game_session_questions;
  const correct = items.filter((item) => item.result === "correct").length;
  const incorrect = items.filter((item) => item.result === "incorrect").length;
  const timedOut = items.filter((item) => item.status === "timed_out").length;
  const notPlayed = items.filter((item) =>
    ["abandoned", "not_played", "cancelled"].includes(item.status),
  ).length;
  const questionsReached = items.filter((item) =>
    ["active", "submitted", "answered", "timed_out", "abandoned"].includes(
      item.status,
    ),
  ).length;
  const answered = correct + incorrect;
  const completed = answered + timedOut;

  return {
    id: session.id,
    sessionType: session.session_type as ActivityHistoryEntry["sessionType"],
    areaId: session.area_id,
    areaName: session.area_name,
    gameType: session.game_type,
    difficulty: session.difficulty as ActivityHistoryEntry["difficulty"],
    status: session.status as ActivityHistoryEntry["status"],
    endReason: (session.end_reason ??
      "completed") as ActivityHistoryEntry["endReason"],
    totalQuestions: session.total_questions,
    correct,
    incorrect,
    timedOut,
    notPlayed,
    questionsReached,
    answered,
    accuracyPercentage: calculatePercentage(correct, answered),
    completionPercentage: calculatePercentage(
      completed,
      session.total_questions,
    ),
    durationSeconds: calculateDurationSeconds(
      session.started_at,
      session.ended_at,
    ),
    preparedAt: session.prepared_at,
    startedAt: session.started_at,
    terminalAt: session.ended_at ?? session.prepared_at,
  };
};

type ActivityHistoryDetailsPayload = {
  gameSessionId: string;
  sessionType: ActivityHistoryEntry["sessionType"];
  items: ActivityHistoryItem[];
};

export const mapActivityHistoryDetails = (
  session: ActivityHistoryGameSessionRow,
  payload: ActivityHistoryDetailsPayload,
): ActivityHistoryDetails => {
  if (
    payload.gameSessionId !== session.id ||
    payload.sessionType !== session.session_type ||
    !Array.isArray(payload.items)
  ) {
    throw new Error("Activity history details are invalid");
  }

  return {
    history: mapActivityHistoryRow(session),
    items: payload.items,
  };
};

export const getActivityHistoryError = (
  error: unknown,
  fallbackMessage: string,
) => (error instanceof Error ? error.message : fallbackMessage);
