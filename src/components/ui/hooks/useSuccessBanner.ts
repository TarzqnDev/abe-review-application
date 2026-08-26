import { useCallback, useState } from "react";
import type { PanInfo } from "motion/react";

const DISMISS_DISTANCE = -24;
const DISMISS_VELOCITY = -500;

type UseSuccessBannerOptions = {
  onDismiss?: () => void;
  show: boolean;
};

export const useSuccessBanner = ({
  onDismiss,
  show,
}: UseSuccessBannerOptions) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, dragInfo: PanInfo) => {
      setIsDragging(false);

      const wasThrownUpward =
        dragInfo.offset.y <= DISMISS_DISTANCE ||
        dragInfo.velocity.y <= DISMISS_VELOCITY;

      if (wasThrownUpward || !show) {
        onDismiss?.();
      }
    },
    [onDismiss, show],
  );

  return {
    handleDragEnd,
    handleDragStart,
    isVisible: show || isDragging,
  };
};
