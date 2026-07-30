"use client";

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import AuthPageShell from "@/features/auth/components/AuthPageShell";
import { useResetPassword } from "@/features/auth/reset-password/hooks/useResetPassword";

export default function ResetPasswordPage() {
  const resetPasswordPage = useResetPassword();

  return (
    <AuthPageShell>
          {resetPasswordPage.status === "loading" ? (
            <div
              className="flex flex-col items-center py-10 text-center"
              role="status"
              aria-live="polite"
            >
              <LoaderCircle className="size-8 animate-spin text-primary-accent" />
              <h1 className="mt-5 text-2xl font-semibold tracking-tight text-primary-text">
                Checking Your Reset Link
              </h1>
              <p className="mt-2 text-sm leading-6 text-secondary-text sm:text-base">
                Please wait while we securely verify your request.
              </p>
            </div>
          ) : resetPasswordPage.status === "initialization-error" ? (
            <div className="flex flex-col items-center text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-amber-50">
                <ExclamationTriangleIcon className="size-9 text-warning" />
              </div>
              <h1 className="mt-6 text-3xl font-semibold tracking-tight text-primary-text">
                Unable to Verify Reset Link
              </h1>
              <p className="mt-3 max-w-md text-sm leading-6 text-secondary-text sm:text-base">
                We could not verify your reset link right now. Check your
                connection and try again.
              </p>
              <button
                type="button"
                onClick={resetPasswordPage.handleRetryInitialization}
                className="mt-8 flex h-12 w-full cursor-pointer items-center justify-center rounded-sm bg-primary-accent px-4 font-medium text-surface transition hover:bg-primary-dark"
              >
                Retry Verification
              </button>
              <Link
                href="/auth/forgot-password"
                className="mt-4 flex h-12 w-full items-center justify-center rounded-sm border border-border px-4 font-medium text-primary-text transition hover:border-primary-accent hover:text-primary-accent"
              >
                Request Another Link
              </Link>
            </div>
          ) : resetPasswordPage.status === "invalid" ? (
            <div className="flex flex-col items-center text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-red-50">
                <ExclamationTriangleIcon className="size-9 text-error" />
              </div>
              <h1 className="mt-6 text-3xl font-semibold tracking-tight text-primary-text">
                Reset Link Unavailable
              </h1>
              <p className="mt-3 max-w-md text-sm leading-6 text-secondary-text sm:text-base">
                This password reset link is invalid, expired, or has already
                been used.
              </p>
              <Link
                href="/auth/forgot-password"
                className="mt-8 flex h-12 w-full items-center justify-center rounded-sm bg-primary-accent px-4 font-medium text-surface transition hover:bg-primary-dark"
              >
                Request Another Link
              </Link>
              <Link
                href="/login"
                className="mt-4 text-sm font-medium text-secondary-text transition hover:text-primary-accent"
              >
                Back to Login
              </Link>
            </div>
          ) : resetPasswordPage.status === "success" ? (
            <div
              className="flex flex-col items-center text-center"
              role="status"
              aria-live="polite"
            >
              <div className="flex size-16 items-center justify-center rounded-full bg-teal-50">
                <CheckCircleIcon className="size-9 text-primary-accent" />
              </div>
              <h1 className="mt-6 text-3xl font-semibold tracking-tight text-primary-text">
                Password Reset Complete
              </h1>
              <p className="mt-3 max-w-md text-sm leading-6 text-secondary-text sm:text-base">
                {resetPasswordPage.successMessage}. You can now log in with
                your new password.
              </p>
              <Link
                href="/login"
                className="mt-8 flex h-12 w-full items-center justify-center rounded-sm bg-primary-accent px-4 font-medium text-surface transition hover:bg-primary-dark"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <div>
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-semibold tracking-tight text-primary-text">
                  Create a New Password
                </h1>
                <p className="mt-2 text-sm leading-6 text-secondary-text sm:text-base">
                  Choose a secure password for your ABEquip account.
                </p>
              </div>

              <form
                onSubmit={resetPasswordPage.handleResetPassword}
                className="flex flex-col gap-5"
              >
                <div className="flex flex-col gap-2">
                  <label htmlFor="password" className="font-medium">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={resetPasswordPage.showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={resetPasswordPage.formData.password}
                      onChange={resetPasswordPage.handleUserInput}
                      autoComplete="new-password"
                      minLength={6}
                      required
                      disabled={resetPasswordPage.isResettingPassword}
                      className="h-12 w-full rounded-sm border border-border px-4 pr-12 outline-none transition focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/15 disabled:cursor-not-allowed disabled:bg-secondary-bg"
                    />
                    <button
                      type="button"
                      onClick={resetPasswordPage.handlePasswordVisibility}
                      aria-label={
                        resetPasswordPage.showPassword
                          ? "Hide new password"
                          : "Show new password"
                      }
                      disabled={resetPasswordPage.isResettingPassword}
                      className="absolute inset-y-0 right-0 flex w-12 cursor-pointer items-center justify-center text-secondary-text disabled:cursor-not-allowed"
                    >
                      {resetPasswordPage.showPassword ? (
                        <EyeSlashIcon className="size-5" />
                      ) : (
                        <EyeIcon className="size-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs leading-5 text-secondary-text">
                    Password must contain at least 6 characters.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="confirmPassword" className="font-medium">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={
                        resetPasswordPage.showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      id="confirmPassword"
                      name="confirmPassword"
                      value={resetPasswordPage.formData.confirmPassword}
                      onChange={resetPasswordPage.handleUserInput}
                      autoComplete="new-password"
                      minLength={6}
                      required
                      disabled={resetPasswordPage.isResettingPassword}
                      className="h-12 w-full rounded-sm border border-border px-4 pr-12 outline-none transition focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/15 disabled:cursor-not-allowed disabled:bg-secondary-bg"
                    />
                    <button
                      type="button"
                      onClick={
                        resetPasswordPage.handleConfirmPasswordVisibility
                      }
                      aria-label={
                        resetPasswordPage.showConfirmPassword
                          ? "Hide confirmed password"
                          : "Show confirmed password"
                      }
                      disabled={resetPasswordPage.isResettingPassword}
                      className="absolute inset-y-0 right-0 flex w-12 cursor-pointer items-center justify-center text-secondary-text disabled:cursor-not-allowed"
                    >
                      {resetPasswordPage.showConfirmPassword ? (
                        <EyeSlashIcon className="size-5" />
                      ) : (
                        <EyeIcon className="size-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={resetPasswordPage.isResettingPassword}
                  className="mt-1 flex h-12 w-full cursor-pointer items-center justify-center rounded-sm bg-primary-accent font-medium text-surface transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {resetPasswordPage.isResettingPassword ? (
                    <>
                      <LoaderCircle
                        className="mr-2 size-5 animate-spin"
                        aria-hidden="true"
                      />
                      Resetting Password
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>

                {resetPasswordPage.error && (
                  <p
                    className="text-sm text-error"
                    role="alert"
                    aria-live="assertive"
                  >
                    {resetPasswordPage.error}
                  </p>
                )}
              </form>
            </div>
          )}
    </AuthPageShell>
  );
}
