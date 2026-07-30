"use client";

import {
  ArrowLeftIcon,
  CheckCircleIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import AuthPageShell from "@/features/auth/components/AuthPageShell";
import EmailNotRegistered from "@/features/auth/forgot-password/components/EmailNotRegistered";
import { useForgotPassword } from "@/features/auth/forgot-password/hooks/useForgotPassword";

export default function ForgotPasswordPage() {
  const {
    email,
    error,
    handleEmailChange,
    handleResend,
    handleSubmission,
    handleUseDifferentEmail,
    isEmailNotRegistered,
    isEmailSent,
    isSubmitting,
    resendCooldownSeconds,
    resendSuccessMessage,
    submittedEmail,
  } = useForgotPassword();

  const resendCooldownMinutes = Math.floor(resendCooldownSeconds / 60);
  const resendCooldownRemainingSeconds = String(
    resendCooldownSeconds % 60,
  ).padStart(2, "0");

  return (
    <AuthPageShell>
          {isEmailNotRegistered ? (
            <EmailNotRegistered
              email={submittedEmail}
              onUseDifferentEmail={handleUseDifferentEmail}
            />
          ) : isEmailSent ? (
            <div className="flex flex-col items-center text-center">
              <div className="relative flex size-16 items-center justify-center rounded-full bg-teal-50">
                <EnvelopeIcon className="size-8 text-primary-accent" />
                <CheckCircleIcon className="absolute -right-1 -bottom-1 size-6 rounded-full bg-surface text-primary-accent" />
              </div>

              <div role="status" aria-live="polite">
                <h1 className="mt-6 text-3xl font-semibold tracking-tight text-primary-text">
                  Check Your Email
                </h1>
                <p className="mt-3 text-sm leading-6 text-secondary-text sm:text-base">
                  We sent a password reset link to{" "}
                  <span className="font-medium text-primary-text">
                    {submittedEmail}
                  </span>
                  .
                </p>
              </div>

              <div className="mt-6 w-full rounded-sm border border-teal-100 bg-teal-50 p-4 text-left">
                <p className="text-sm leading-6 text-secondary-text">
                  The email may take a few minutes to arrive. Check your spam
                  folder if you do not see it in your inbox.
                </p>
              </div>

              <button
                type="button"
                onClick={handleResend}
                disabled={isSubmitting || resendCooldownSeconds > 0}
                className="mt-8 flex h-12 w-full cursor-pointer items-center justify-center rounded-sm bg-primary-accent font-medium text-surface transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <LoaderCircle className="animate-spin" />
                ) : resendCooldownSeconds > 0 ? (
                  <span>
                    Resend available in {resendCooldownMinutes}m{" "}
                    {resendCooldownRemainingSeconds}s
                  </span>
                ) : (
                  "Resend Reset Link"
                )}
              </button>

              <button
                type="button"
                onClick={handleUseDifferentEmail}
                disabled={isSubmitting}
                className="mt-4 cursor-pointer font-medium text-primary-accent transition hover:text-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
              >
                Use a different email
              </button>

              {error && (
                <p
                  className="mt-4 text-sm text-error"
                  role="alert"
                  aria-live="assertive"
                >
                  {error}
                </p>
              )}

              {resendSuccessMessage && (
                <p
                  className="mt-4 text-sm font-medium text-primary-accent"
                  role="status"
                  aria-live="polite"
                >
                  {resendSuccessMessage}
                </p>
              )}

              <Link
                href="/login"
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-sm border border-primary-accent font-medium text-primary-accent transition hover:bg-teal-50"
              >
                <ArrowLeftIcon className="size-4" />
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-10 text-center">
                <h1 className="text-3xl font-semibold tracking-tight text-primary-text">
                  Forgot Your Password?
                </h1>
                <p className="mt-2 text-sm leading-6 text-secondary-text sm:text-base">
                  Enter your email address and we&apos;ll send you a secure link
                  to create a new password.
                </p>
              </div>

              <form onSubmit={handleSubmission} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                    autoComplete="email"
                    aria-describedby={
                      error ? "forgot-password-error" : undefined
                    }
                    aria-invalid={Boolean(error)}
                    className="h-12 w-full rounded-sm border border-border px-4 outline-none transition focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/15"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-1 flex h-12 w-full cursor-pointer items-center justify-center rounded-sm bg-primary-accent font-medium text-surface transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    "Send Reset Link"
                  )}
                </button>

                {error && (
                  <p
                    id="forgot-password-error"
                    className="text-sm text-error"
                    role="alert"
                    aria-live="assertive"
                  >
                    {error}
                  </p>
                )}
              </form>

              <div className="mt-2 flex justify-center">
                <Link
                  href="/login"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-sm border border-primary-accent font-medium text-primary-accent transition hover:bg-teal-50"
                >
                  <ArrowLeftIcon className="size-4" />
                  Back to Login
                </Link>
              </div>
            </>
          )}
    </AuthPageShell>
  );
}
