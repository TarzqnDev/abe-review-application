"use client";

import AuthenticationSuccessBanner from "@/features/app/layout/components/AuthenticationSuccessBanner";
import { useAppLayout } from "@/features/app/layout/hooks/useAppLayout";

export default function AuthenticationSuccessNotice() {
  const { dismissSuccessBanner, showSuccessBanner, successMessage } =
    useAppLayout();

  return (
    <AuthenticationSuccessBanner
      message={successMessage}
      onDismiss={dismissSuccessBanner}
      show={showSuccessBanner}
    />
  );
}
