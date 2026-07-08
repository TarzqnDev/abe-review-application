import { useEffect, useRef, useState } from "react";

export const MODAL_ANIMATION_DURATION_MS = 300;

export const useModalAnimation = (open: boolean) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      setIsModalVisible(open);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [open]);

  useEffect(
    () => () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    },
    [],
  );

  const closeWithAnimation = (onClosed: () => void) => {
    setIsModalVisible(false);

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    closeTimeoutRef.current = setTimeout(() => {
      onClosed();
    }, MODAL_ANIMATION_DURATION_MS);
  };

  return {
    closeWithAnimation,
    isModalVisible,
  };
};
