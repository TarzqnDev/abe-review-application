"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import AuthenticationSuccessNotice from "@/features/app/layout/components/AuthenticationSuccessNotice";
import type { AppRole } from "@/features/app/layout/types/appRole";
import { Suspense } from "react";

type AppLayoutClientProps = {
  children: React.ReactNode;
  role: AppRole | null;
};

export default function AppLayoutClient({
  children,
  role,
}: AppLayoutClientProps) {
  return (
    <div className="min-h-screen bg-primary-bg text-primary-text">
      <Suspense fallback={null}>
        <AuthenticationSuccessNotice />
      </Suspense>
      <Navbar role={role} />
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-10 px-5 py-10 md:grid-cols-[250px_1fr]">
        <Sidebar role={role} />
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
