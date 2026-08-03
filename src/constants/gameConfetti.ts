export type GameConfettiPiece = {
  color: string;
  delay: number;
  duration: number;
  horizontalDrift: number;
  left: number;
  rotation: number;
  rounded: boolean;
  size: number;
};

const CONFETTI_COLORS = [
  "#009688",
  "#0fa08f",
  "#10b981",
  "#f59e0b",
  "#f97316",
  "#3b82f6",
  "#ec4899",
];

export const GAME_CONFETTI_PIECES: GameConfettiPiece[] = Array.from(
  { length: 56 },
  (_unusedValue, pieceIndex) => ({
    color: CONFETTI_COLORS[pieceIndex % CONFETTI_COLORS.length],
    delay: (pieceIndex % 14) * 0.08,
    duration: 2.35 + (pieceIndex % 7) * 0.13,
    horizontalDrift: ((pieceIndex * 29) % 150) - 75,
    left: (pieceIndex * 37 + 7) % 100,
    rotation: 420 + (pieceIndex % 8) * 75,
    rounded: pieceIndex % 4 === 0,
    size: 6 + (pieceIndex % 5) * 2,
  }),
);
