"use client";

import {
  AUTH_NOTICE_MESSAGES,
  AUTH_NOTICE_QUERY_PARAMETER,
  type AuthNotice,
} from "@/features/app/layout/constants/authNotices";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SUCCESS_BANNER_DURATION = 4000;
const SUCCESS_BANNER_TRANSITION_DURATION = 500;

const isAuthNotice = (notice: string): notice is AuthNotice =>
  Object.hasOwn(AUTH_NOTICE_MESSAGES, notice);

export const useAppLayout = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [successMessage] = useState(() => {
    const notice = searchParams.get(AUTH_NOTICE_QUERY_PARAMETER);

    return notice && isAuthNotice(notice) ? AUTH_NOTICE_MESSAGES[notice] : "";
  });
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  useEffect(() => {
    if (!successMessage) return;

    const entranceFrame = requestAnimationFrame(() => {
      setShowSuccessBanner(true);
    });
    const hideTimeout = setTimeout(() => {
      setShowSuccessBanner(false);
    }, SUCCESS_BANNER_DURATION - SUCCESS_BANNER_TRANSITION_DURATION);
    const cleanupTimeout = setTimeout(() => {
      const currentUrl = new URL(window.location.href);

      if (!currentUrl.searchParams.has(AUTH_NOTICE_QUERY_PARAMETER)) return;

      currentUrl.searchParams.delete(AUTH_NOTICE_QUERY_PARAMETER);

      const queryString = currentUrl.searchParams.toString();
      const currentPath = `${currentUrl.pathname}${
        queryString ? `?${queryString}` : ""
      }${currentUrl.hash}`;

      router.replace(currentPath, { scroll: false });
    }, SUCCESS_BANNER_DURATION);

    return () => {
      cancelAnimationFrame(entranceFrame);
      clearTimeout(hideTimeout);
      clearTimeout(cleanupTimeout);
    };
  }, [router, successMessage]);

  return {
    showSuccessBanner,
    successMessage,
  };
};
