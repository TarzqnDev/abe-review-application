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
    <div className="flex h-dvh flex-col overflow-hidden bg-primary-bg text-primary-text">
      <Suspense fallback={null}>
        <AuthenticationSuccessNotice />
      </Suspense>
      <Navbar role={role} />
      <div className="mx-auto grid min-h-0 w-full max-w-[1200px] flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)] px-5 md:grid-cols-[250px_1fr] md:grid-rows-1 md:gap-10">
        <Sidebar role={role} />
        <main
          className="min-h-0 min-w-0 overflow-y-auto py-10"
          data-app-scroll-container
        >
          {children}
        </main>
      </div>
    </div>
  );
}
