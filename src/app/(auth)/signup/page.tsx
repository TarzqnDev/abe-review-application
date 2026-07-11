"use client";

import { EyeIcon, EyeSlashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { LoaderCircle } from "lucide-react";
import AuthBrand from "@/features/auth/components/AuthBrand";
import AuthImagePanel from "@/features/auth/components/AuthImagePanel";
import { useSignup } from "@/features/auth/signup/hooks/useSignup";
import { useAuth } from "@/providers/AuthProvider";

export default function SignupPage() {
  const { user } = useAuth();
  const {
    error,
    formData,
    handleCloseRequestAccessModal,
    handleConfirmPasswordVisibility,
    handleOpenRequestAccessModal,
    handlePasswordVisibility,
    handleRequestAccessInput,
    handleRequestAccessSubmission,
    handleSignup,
    handleUserInput,
    hasInviteSession,
    isRequestAccessModalOpen,
    isSigningUp,
    isSubmittingRequestAccess,
    requestAccessError,
    requestAccessFormData,
    requestAccessSuccessBannerMessage,
    showConfirmPassword,
    showPassword,
    showRequestAccessSuccessBanner,
    showSignupSuccessBanner,
    signupSuccessBannerMessage,
  } = useSignup();

  return (
    <>
      <div
        className={`fixed left-1/2 z-60 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 transition-all duration-500 ease-out ${
          showSignupSuccessBanner
            ? "top-12 opacity-100"
            : "pointer-events-none -top-24 opacity-0"
        }`}
      >
        <div className="rounded-lg border border-teal-700 bg-teal-800 px-5 py-4 shadow-lg">
          <p className="text-center font-medium text-white">
            {signupSuccessBannerMessage}
          </p>
          <p className="mt-1 text-center text-sm text-teal-100">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>

      <div
        className={`fixed left-1/2 z-60 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 transition-all duration-500 ease-out ${
          showRequestAccessSuccessBanner
            ? "top-36 opacity-100"
            : "pointer-events-none -top-24 opacity-0"
        }`}
      >
        <div className="rounded-lg border border-teal-700 bg-teal-800 px-5 py-4 shadow-lg">
          <p className="text-center font-medium text-white">
            {requestAccessSuccessBannerMessage}
          </p>
        </div>
      </div>

      <main className="flex min-h-screen bg-white">
        <AuthImagePanel />

        <section className="flex min-h-screen w-full justify-center overflow-y-auto px-6 py-8 text-black sm:px-10 lg:w-2/5 lg:px-12 lg:py-16 xl:px-20">
          <div className="flex w-full max-w-md flex-col">
            <AuthBrand />

            <div className="my-auto py-12">
              <div className="mb-8">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                  Complete Your Signup
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                  Create your password to start your review.
                </p>
              </div>

              {hasInviteSession === null ? (
                <div className="rounded-sm border border-slate-200 bg-slate-50 p-4 text-slate-600">
                  Checking your invite link...
                </div>
              ) : !hasInviteSession ? (
                <div className="flex flex-col gap-5">
                  <div className="rounded-sm border border-red-200 bg-red-50 p-4 text-red-700">
                    Your invite link is invalid or has expired.
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenRequestAccessModal}
                    className="h-12 cursor-pointer rounded-sm bg-teal-600 px-4 font-medium text-white transition hover:bg-teal-700"
                  >
                    Request Registration Access
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSignup} className="flex flex-col gap-5">
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
                      className="h-12 w-full rounded-sm border border-slate-200 bg-slate-50 px-4 text-slate-500"
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
                        className="h-12 w-full rounded-sm border border-slate-200 px-4 pr-12 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15"
                      />
                      <button
                        type="button"
                        onClick={handlePasswordVisibility}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute inset-y-0 right-0 flex w-12 cursor-pointer items-center justify-center text-slate-500"
                      >
                        {showPassword ? <EyeSlashIcon className="size-5" /> : <EyeIcon className="size-5" />}
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
                        className="h-12 w-full rounded-sm border border-slate-200 px-4 pr-12 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15"
                      />
                      <button
                        type="button"
                        onClick={handleConfirmPasswordVisibility}
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        className="absolute inset-y-0 right-0 flex w-12 cursor-pointer items-center justify-center text-slate-500"
                      >
                        {showConfirmPassword ? <EyeSlashIcon className="size-5" /> : <EyeIcon className="size-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSigningUp}
                    className="mt-1 flex h-12 w-full cursor-pointer items-center justify-center rounded-sm bg-teal-600 font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSigningUp ? <LoaderCircle className="animate-spin" /> : "Complete Signup"}
                  </button>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </form>
              )}
            </div>
          </div>

          {/* Modals */}
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-opacity duration-300 ${
              isRequestAccessModalOpen
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            <button
              type="button"
              aria-label="Close request access modal"
              className="absolute inset-0 bg-black/50"
              onClick={handleCloseRequestAccessModal}
            />
            <div
              className={`relative w-full max-w-xl rounded-lg bg-white p-6 shadow-xl transition-all duration-300 ease-out ${
                isRequestAccessModalOpen
                  ? "translate-y-0 scale-100 opacity-100"
                  : "-translate-y-4 scale-95 opacity-0"
              }`}
            >
              <button
                type="button"
                onClick={handleCloseRequestAccessModal}
                aria-label="Close request access modal"
                className="absolute top-3 right-3 cursor-pointer"
              >
                <XMarkIcon className="size-5 text-slate-500" />
              </button>
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold">Request Registration Access</h2>
                <p className="text-slate-600">
                  Add your email address and we&apos;ll notify the admin once this feature is available.
                </p>
                <form onSubmit={handleRequestAccessSubmission} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="requestAccessEmail" className="font-medium">Email Address</label>
                    <input
                      type="email"
                      id="requestAccessEmail"
                      name="email"
                      value={requestAccessFormData.email}
                      onChange={handleRequestAccessInput}
                      autoComplete="email"
                      className="h-12 w-full rounded-sm border border-slate-200 px-4 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmittingRequestAccess}
                    className="flex h-12 cursor-pointer items-center justify-center rounded-sm bg-teal-600 px-4 font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmittingRequestAccess ? <LoaderCircle className="animate-spin" /> : "Submit Request"}
                  </button>
                  {requestAccessError && <p className="text-sm text-red-500">{requestAccessError}</p>}
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
