"use client";

import {
  AUTH_NOTICE_MESSAGES,
  AUTH_NOTICE_QUERY_PARAMETER,
  type AuthNotice,
} from "@/features/app/layout/constants/authNotices";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SUCCESS_BANNER_DURATION = 4000;
const SUCCESS_BANNER_TRANSITION_DURATION = 500;

const isAuthNotice = (notice: string): notice is AuthNotice =>
  Object.hasOwn(AUTH_NOTICE_MESSAGES, notice);

export const useAppLayout = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const notice = searchParams.get(AUTH_NOTICE_QUERY_PARAMETER);
  const successMessage =
    notice && isAuthNotice(notice) ? AUTH_NOTICE_MESSAGES[notice] : "";
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
      const nextSearchParams = new URLSearchParams(searchParams.toString());
      nextSearchParams.delete(AUTH_NOTICE_QUERY_PARAMETER);

      const queryString = nextSearchParams.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    }, SUCCESS_BANNER_DURATION);

    return () => {
      cancelAnimationFrame(entranceFrame);
      clearTimeout(hideTimeout);
      clearTimeout(cleanupTimeout);
    };
  }, [pathname, router, searchParams, successMessage]);

  return {
    showSuccessBanner,
    successMessage,
  };
};
