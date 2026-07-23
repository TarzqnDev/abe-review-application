type GameSummaryPresentationInput = {
  correct: number;
  incorrect: number;
  timedOut: number;
  totalQuestions: number;
  durationSeconds: number;
};

const getPerformanceMessage = (scorePercentage: number) => {
  if (scorePercentage >= 75) return "Excellent Work!";
  if (scorePercentage >= 50) return "Good Work!";
  return "Keep Practicing!";
};

const formatDuration = (durationSeconds: number) => {
  const safeDurationSeconds = Math.floor(Math.max(0, durationSeconds));
  const minutes = Math.floor(safeDurationSeconds / 60);
  const seconds = safeDurationSeconds % 60;

  return `${minutes}m ${seconds}s`;
};

export const getGameSummaryPresentation = (
  summary: GameSummaryPresentationInput | null,
) => {
  const totalQuestions = Math.max(0, summary?.totalQuestions ?? 0);
  const correctPercentage =
    totalQuestions === 0
      ? 0
      : Math.min(
          100,
          (Math.max(0, summary?.correct ?? 0) / totalQuestions) * 100,
        );
  const incorrectPercentage =
    totalQuestions === 0
      ? 0
      : (Math.max(0, summary?.incorrect ?? 0) / totalQuestions) * 100;
  const timedOutPercentage =
    totalQuestions === 0
      ? 0
      : (Math.max(0, summary?.timedOut ?? 0) / totalQuestions) * 100;
  const scorePercentage = Math.round(correctPercentage);
  const correctEnd = correctPercentage;
  const incorrectEnd = Math.min(100, correctEnd + incorrectPercentage);
  const timedOutEnd = Math.min(100, incorrectEnd + timedOutPercentage);

  return {
    donutBackground: `conic-gradient(var(--color-primary-accent) 0% ${correctEnd}%, var(--color-error) ${correctEnd}% ${incorrectEnd}%, var(--color-warning) ${incorrectEnd}% ${timedOutEnd}%, var(--color-border) ${timedOutEnd}% 100%)`,
    duration: formatDuration(summary?.durationSeconds ?? 0),
    performanceMessage: getPerformanceMessage(scorePercentage),
    scorePercentage,
  };
};
