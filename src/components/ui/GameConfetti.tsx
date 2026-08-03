import type { CSSProperties } from "react";

import styles from "@/components/ui/GameConfetti.module.css";
import { GAME_CONFETTI_PIECES } from "@/constants/gameConfetti";

type ConfettiCssProperties = CSSProperties & {
  "--confetti-color": string;
  "--confetti-delay": string;
  "--confetti-drift": string;
  "--confetti-duration": string;
  "--confetti-left": string;
  "--confetti-radius": string;
  "--confetti-rotation": string;
  "--confetti-size": string;
};

export default function GameConfetti() {
  return (
    <div
      aria-hidden="true"
      className={`${styles.container} pointer-events-none absolute inset-0 z-0`}
    >
      {GAME_CONFETTI_PIECES.map((piece, pieceIndex) => {
        const style: ConfettiCssProperties = {
          "--confetti-color": piece.color,
          "--confetti-delay": `${piece.delay}s`,
          "--confetti-drift": `${piece.horizontalDrift}px`,
          "--confetti-duration": `${piece.duration}s`,
          "--confetti-left": `${piece.left}%`,
          "--confetti-radius": piece.rounded ? "9999px" : "1px",
          "--confetti-rotation": `${piece.rotation}deg`,
          "--confetti-size": `${piece.size}px`,
        };

        return (
          <span
            className={styles.piece}
            key={`${piece.left}-${pieceIndex}`}
            style={style}
          />
        );
      })}
    </div>
  );
}
