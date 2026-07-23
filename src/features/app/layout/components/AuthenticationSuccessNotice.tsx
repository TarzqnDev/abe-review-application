"use client";

import AuthenticationSuccessBanner from "@/features/app/layout/components/AuthenticationSuccessBanner";
import { useAppLayout } from "@/features/app/layout/hooks/useAppLayout";

export default function AuthenticationSuccessNotice() {
  const { showSuccessBanner, successMessage } = useAppLayout();

  return (
    <AuthenticationSuccessBanner
      message={successMessage}
      show={showSuccessBanner}
    />
  );
}
