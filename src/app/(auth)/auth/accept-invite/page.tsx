"use client";

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { LoaderCircle } from "lucide-react";
import AuthBrand from "@/features/auth/components/AuthBrand";
import { useAcceptInvite } from "@/features/auth/accept-invite/hooks/useAcceptInvite";
import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";

export default function AcceptInvitePage() {
  const { user } = useAuth();
  const {
    accountSetupStatusError,
    accountSetupSuccessBannerMessage,
    error,
    formData,
    handleCompleteAccountSetup,
    handleConfirmPasswordVisibility,
    handleGoToDashboard,
    handlePasswordVisibility,
    handleUserInput,
    hasInviteSession,
    isAccountSetupCompleted,
    isCompletingAccountSetup,
    showAccountSetupSuccessBanner,
    showConfirmPassword,
    showPassword,
  } = useAcceptInvite();

  return (
    <>
      <div
        className={`fixed left-1/2 z-60 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 transition-all duration-500 ease-out ${
          showAccountSetupSuccessBanner
            ? "top-12 opacity-100"
            : "pointer-events-none -top-24 opacity-0"
        }`}
      >
        <div className="rounded-lg border border-primary-dark bg-teal-800 px-5 py-4 shadow-lg">
          <p className="text-center font-medium text-surface">
            {accountSetupSuccessBannerMessage}
          </p>
          <p className="mt-1 text-center text-sm text-teal-100">
            You can now go to your dashboard.
          </p>
        </div>
      </div>

      <main className="flex min-h-screen items-center justify-center bg-secondary-bg px-6 py-10 text-black sm:px-10">
        <section className="w-full max-w-xl">
          <div className="mb-8 flex justify-center">
            <AuthBrand />
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-xl shadow-border/60 sm:p-10">
            {hasInviteSession === null ? (
              <div className="flex flex-col items-center py-10 text-center">
                <LoaderCircle className="size-8 animate-spin text-primary-accent" />
                <h1 className="mt-5 text-2xl font-semibold tracking-tight text-primary-text">
                  Checking Your Invitation
                </h1>
                <p className="mt-2 text-sm leading-6 text-secondary-text sm:text-base">
                  Please wait while we verify your invite link.
                </p>
              </div>
            ) : !hasInviteSession ? (
              <div className="flex flex-col items-center text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-red-50">
                  <ExclamationTriangleIcon className="size-9 text-error" />
                </div>
                <h1 className="mt-6 text-3xl font-semibold tracking-tight text-primary-text">
                  Invitation Unavailable
                </h1>
                <p className="mt-3 max-w-md text-sm leading-6 text-secondary-text sm:text-base">
                  This invitation link is invalid, expired, or has already been
                  used. Please ask an administrator to register your account or
                  send a new email invitation.
                </p>
              </div>
            ) : accountSetupStatusError ? (
              <div className="flex flex-col gap-5 text-center">
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight text-primary-text">
                    Unable to Check Your Account
                  </h1>
                  <p className="mt-2 text-sm leading-6 text-secondary-text sm:text-base">
                    Please refresh this page and try again.
                  </p>
                </div>
                <div className="rounded-sm border border-red-200 bg-red-50 p-4 text-red-700">
                  {accountSetupStatusError}
                </div>
              </div>
            ) : isAccountSetupCompleted === null ? (
              <div className="flex flex-col items-center py-10 text-center">
                <LoaderCircle className="size-8 animate-spin text-primary-accent" />
                <h1 className="mt-5 text-2xl font-semibold tracking-tight text-primary-text">
                  Checking Your Account
                </h1>
                <p className="mt-2 text-sm leading-6 text-secondary-text sm:text-base">
                  Please wait while we confirm your account status.
                </p>
              </div>
            ) : isAccountSetupCompleted ? (
              <div className="flex flex-col items-center text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-teal-50">
                  <CheckCircleIcon className="size-9 text-primary-accent" />
                </div>
                <h1 className="mt-6 text-3xl font-semibold tracking-tight text-primary-text">
                  Invitation Already Accepted
                </h1>
                <p className="mt-3 max-w-md text-sm leading-6 text-secondary-text sm:text-base">
                  Your account setup is already complete. Continue to your
                  dashboard to start reviewing.
                </p>
                <button
                  type="button"
                  onClick={handleGoToDashboard}
                  className="mt-8 h-12 w-full cursor-pointer rounded-sm bg-primary-accent px-4 font-medium text-surface transition hover:bg-primary-dark"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-8 text-center">
                  <h1 className="text-3xl font-semibold tracking-tight text-primary-text">
                    Complete Your Account
                  </h1>
                  <p className="mt-2 text-sm leading-6 text-secondary-text sm:text-base">
                    Create your password to accept your invitation and get
                    started.
                  </p>
                </div>

                <form
                  onSubmit={handleCompleteAccountSetup}
                  className="flex flex-col gap-5"
                >
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={user?.email ?? ""}
                      disabled
                      className="h-12 w-full rounded-sm border border-border bg-secondary-bg px-4 text-secondary-text"
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
                        value={formData.password}
                        onChange={handleUserInput}
                        autoComplete="new-password"
                        className="h-12 w-full rounded-sm border border-border px-4 pr-12 outline-none transition focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/15"
                      />
                      <button
                        type="button"
                        onClick={handlePasswordVisibility}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute inset-y-0 right-0 flex w-12 cursor-pointer items-center justify-center text-secondary-text"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="size-5" />
                        ) : (
                          <EyeIcon className="size-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="confirmPassword" className="font-medium">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleUserInput}
                        autoComplete="new-password"
                        className="h-12 w-full rounded-sm border border-border px-4 pr-12 outline-none transition focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/15"
                      />
                      <button
                        type="button"
                        onClick={handleConfirmPasswordVisibility}
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                        className="absolute inset-y-0 right-0 flex w-12 cursor-pointer items-center justify-center text-secondary-text"
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="size-5" />
                        ) : (
                          <EyeIcon className="size-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isCompletingAccountSetup}
                    className="mt-1 flex h-12 w-full cursor-pointer items-center justify-center rounded-sm bg-primary-accent font-medium text-surface transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isCompletingAccountSetup ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      "Complete Account"
                    )}
                  </button>
                  {error && <p className="text-sm text-error">{error}</p>}
                </form>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
