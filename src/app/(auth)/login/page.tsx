"use client";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { LoaderCircle } from "lucide-react";
import AuthBrand from "@/features/auth/components/AuthBrand";
import AuthImagePanel from "@/features/auth/components/AuthImagePanel";
import { useLogin } from "@/features/auth/login/hooks/useLogin";

export default function LoginPage() {
  const {
    error,
    formData,
    handleLogin,
    handlePasswordVisibility,
    handleUserInput,
    isLoggingin,
    showPassword,
  } = useLogin();

  return (
    <main className="flex min-h-screen bg-surface">
      <AuthImagePanel />

      <section className="flex min-h-screen w-full justify-center px-6 py-8 text-black sm:px-10 lg:w-2/5 lg:px-12 lg:py-16 xl:px-20">
        <div className="flex w-full max-w-md flex-col">
          <AuthBrand />

          <div className="my-auto py-14">
            <div className="mb-10">
              <h1 className="text-3xl font-semibold tracking-tight text-primary-text">
                Grow Your Knowledge
              </h1>
              <p className="mt-2 max-w-md text-sm leading-6 text-secondary-text sm:text-base">
                A learning platform designed to help you grow at your own pace
                through quizzes, flashcards, and reviews.
              </p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue={formData.email}
                  onChange={handleUserInput}
                  autoComplete="email"
                  className="h-12 w-full rounded-sm border border-border px-4 outline-none transition focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/15"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    defaultValue={formData.password}
                    onChange={handleUserInput}
                    autoComplete="current-password"
                    className="h-12 w-full rounded-sm border border-border px-4 pr-12 outline-none transition focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/15"
                  />
                  <button
                    type="button"
                    onClick={handlePasswordVisibility}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 flex w-12 cursor-pointer items-center justify-center text-secondary-text"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="size-5" />
                    ) : (
                      <EyeIcon className="size-5" />
                    )}
                  </button>
                </div>
                <div className="flex justify-end">
                  <button type="button" className="cursor-pointer font-medium">
                    Forgot Password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingin}
                className="mt-1 flex h-12 w-full cursor-pointer items-center justify-center rounded-sm bg-primary-accent font-medium text-surface transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoggingin ? <LoaderCircle className="animate-spin" /> : "Login"}
              </button>
              {error && <p className="text-sm text-error">{error}</p>}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
