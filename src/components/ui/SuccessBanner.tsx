"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSuccessBanner } from "@/components/ui/hooks/useSuccessBanner";

type SuccessBannerProps = {
  message: string;
  onDismiss?: () => void;
  show: boolean;
};

export default function SuccessBanner({
  message,
  onDismiss,
  show,
}: SuccessBannerProps) {
  const { handleDragEnd, handleDragStart, isVisible } = useSuccessBanner({
    onDismiss,
    show,
  });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="fixed left-1/2 top-8 z-[90] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 touch-none"
          drag="y"
          dragConstraints={{ top: -32, bottom: 0 }}
          dragElastic={0}
          exit={{ opacity: 0, y: -120 }}
          initial={{ opacity: 0, y: -120 }}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          role="status"
          transition={{ duration: 0.5, ease: "easeOut" }}
          aria-live="polite"
        >
          <p className="rounded-lg border-2 border-primary-accent bg-success-bg px-5 py-4 text-center font-semibold text-primary-accent">
            {message}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
