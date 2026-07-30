import type { ReactNode } from "react";
import AuthBrand from "@/features/auth/components/AuthBrand";

type AuthPageShellProps = {
  children: ReactNode;
};

export default function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary-bg px-5 py-8 text-black sm:px-8">
      <section className="w-full max-w-[530px] rounded-md border border-border bg-surface px-6 py-10 shadow-sm sm:px-10">
        <div className="mb-10 flex justify-center">
          <AuthBrand />
        </div>
        {children}
      </section>
    </main>
  );
}
