"use client";

import { getAccountAccessState } from "@/features/app/layout/actions/get-account-access-state.action";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const ACCOUNT_STATUS_REFRESH_INTERVAL = 30_000;

export const useAccountAccess = (initialIsInactive: boolean) => {
  const router = useRouter();
  const [isInactive, setIsInactive] = useState(initialIsInactive);
  const isRefreshingRef = useRef(false);

  const refreshAccountAccess = useCallback(async () => {
    if (isRefreshingRef.current) return;

    isRefreshingRef.current = true;

    try {
      const accessState = await getAccountAccessState();

      if (!accessState.isAuthenticated) {
        router.replace("/login");
        return;
      }

      setIsInactive(accessState.isInactive ?? true);
    } catch {
      setIsInactive(true);
    } finally {
      isRefreshingRef.current = false;
    }
  }, [router]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") void refreshAccountAccess();
    };
    const refreshInterval = window.setInterval(
      () => void refreshAccountAccess(),
      ACCOUNT_STATUS_REFRESH_INTERVAL,
    );

    window.addEventListener("focus", refreshAccountAccess);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(refreshInterval);
      window.removeEventListener("focus", refreshAccountAccess);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refreshAccountAccess]);

  return { isInactive };
};
