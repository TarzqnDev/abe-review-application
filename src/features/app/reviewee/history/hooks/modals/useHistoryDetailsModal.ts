import { useCallback, useEffect, useRef, useState } from "react";
import { fetchActivityHistoryDetails } from "@/features/app/reviewee/history/actions/fetch-activity-history-details.action";
import type { ActivityHistoryDetails } from "@/features/app/reviewee/history/types/activityHistory";
import { useQuizModalAccessibility } from "@/features/app/reviewee/mcq-quiz/hooks/modals/useQuizModalAccessibility";

type UseHistoryDetailsModalProps = {
  sessionId: string | null;
  isOpen: boolean;
  onClose: () => void;
};

export const useHistoryDetailsModal = ({
  sessionId,
  isOpen,
  onClose,
}: UseHistoryDetailsModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const requestIdRef = useRef(0);
  const [details, setDetails] = useState<ActivityHistoryDetails | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleClose = useCallback(() => {
    requestIdRef.current += 1;
    onClose();
  }, [onClose]);
  const modalAccessibility = useQuizModalAccessibility({
    initialFocusRef: closeButtonRef,
    isOpen,
    onClose: handleClose,
  });

  const loadDetails = useCallback(async () => {
    if (!isOpen || sessionId === null) return;

    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setError("");

    const result = await fetchActivityHistoryDetails({ sessionId });

    if (requestId !== requestIdRef.current) return;

    if (!result.success || !result.details) {
      setDetails(null);
      setError(result.error ?? "Unable to load this activity");
      setIsLoading(false);
      return;
    }

    setDetails(result.details);
    setIsLoading(false);
  }, [sessionId, isOpen]);

  useEffect(() => {
    if (!isOpen || sessionId === null) {
      requestIdRef.current += 1;
      return;
    }

    void Promise.resolve().then(loadDetails);

    return () => {
      requestIdRef.current += 1;
    };
  }, [sessionId, isOpen, loadDetails]);

  return {
    closeButtonRef,
    details,
    error,
    handleClose,
    isLoading,
    loadDetails,
    modalAccessibility,
  };
};
