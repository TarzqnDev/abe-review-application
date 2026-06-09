"use client";

import Image from "next/image";
import authBackground from "@/public/authBackground.jpg";
import { useSignup } from "@/features/signup/hooks/useSignup";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/providers/AuthProvider";
import { LoaderCircle } from "lucide-react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { user } = useAuth();
  const {
    handleSignup,
    handleCloseRequestAccessModal,
    handleOpenRequestAccessModal,
    handleRequestAccessSubmission,
    handleRequestAccessInput,
    handleUserInput,
    formData,
    error,
    hasInviteSession,
    isRequestAccessModalOpen,
    isSubmittingRequestAccess,
    isSigningUp,
    requestAccessError,
    requestAccessFormData,
    requestAccessSuccessBannerMessage,
    showSignupSuccessBanner,
    showRequestAccessSuccessBanner,
    signupSuccessBannerMessage,
  } = useSignup();

  return (
    <>
      <div
        className={`fixed left-1/2 z-60 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 transition-all duration-500 ease-out ${
          showSignupSuccessBanner
            ? "top-12 opacity-100"
            : "-top-24 opacity-0 pointer-events-none"
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
            : "-top-24 opacity-0 pointer-events-none"
        }`}
      >
        <div className="rounded-lg border border-teal-700 bg-teal-800 px-5 py-4 shadow-lg">
          <p className="text-center font-medium text-white">
            {requestAccessSuccessBannerMessage}
          </p>
        </div>
      </div>

      <div className="flex h-screen">
        <section className="relative rounded-tr-[125px] w-3/5 overflow-hidden">
          <Image
            src={authBackground}
            alt="Authentication Background"
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 bg-linear-to-r from-teal-600 via-teal-200 to-white opacity-60"></div>
        </section>

        <section className=" bg-white w-2/5 flex items-center justify-center">
          <div className="w-112.5 text-black flex flex-col gap-10">
            <div>
              <h1 className="text-2xl font-semibold text-teal-800">
                Complete Your Signup
              </h1>
              <p>Create your password to start your review.</p>
            </div>

            {hasInviteSession === null ? (
              <div className="border border-gray-200 bg-stone-50 text-stone-600 rounded-md p-4">
                Checking your invite link...
              </div>
            ) : !hasInviteSession ? (
              <div className="flex flex-col gap-4">
                <div className="border border-red-200 bg-red-50 text-red-700 rounded-md p-4">
                  Your invite link is invalid or has expired.
                </div>

                <button
                  type="button"
                  onClick={handleOpenRequestAccessModal}
                  className="bg-teal-800 text-white font-semibold py-3 px-4 rounded-md cursor-pointer"
                >
                  Request Registration Access
                </button>
              </div>
            ) : (
              <div>
                <form onSubmit={handleSignup} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-medium">
                      Email Address
                    </label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={user?.email ?? ""}
                      disabled
                      className="border border-gray-300 w-full py-3 px-4 rounded-md bg-stone-50 text-stone-500"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="font-medium ">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleUserInput}
                        placeholder="Password"
                        className="border border-gray-300 w-full py-3 px-4 rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-500 cursor-pointer" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-500 cursor-pointer" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="confirmPassword" className="font-medium ">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleUserInput}
                        placeholder="Confirm Password"
                        className="border border-gray-300 w-full py-3 px-4 rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-500 cursor-pointer" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-500 cursor-pointer" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <button className="bg-teal-800 text-white font-semibold w-full py-3 rounded-md cursor-pointer flex justify-center items-center">
                      {isSigningUp ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        "Complete Signup"
                      )}
                    </button>
                  </div>
                  {error && <p className="text-red-500">{error}</p>}
                </form>
              </div>
            )}
          </div>

          <div
            className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-opacity duration-300 ${
              isRequestAccessModalOpen
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={handleCloseRequestAccessModal}
            ></div>

            <div
              className={`relative w-full max-w-xl rounded-lg bg-white p-6 shadow-xl transition-all duration-300 ease-out ${
                isRequestAccessModalOpen
                  ? "translate-y-0 scale-100 opacity-100"
                  : "-translate-y-4 scale-95 opacity-0"
              }`}
            >
              <div>
                <button
                  type="button"
                  onClick={handleCloseRequestAccessModal}
                  className="absolute top-3 right-3 cursor-pointer"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <h1 className="font-semibold text-xl">
                  Request Registration Access
                </h1>
                <p className="text-stone-600">
                  Add your email address and we&apos;ll notify the admin once
                  this feature is available.
                </p>

                <form
                  onSubmit={handleRequestAccessSubmission}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-2">
                    <label htmlFor="requestAccessEmail" className="font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="requestAccessEmail"
                      name="email"
                      placeholder="Email Address"
                      value={requestAccessFormData.email}
                      onChange={handleRequestAccessInput}
                      className="border border-gray-300 w-full py-3 px-4 rounded-md"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-teal-800 text-white font-semibold py-3 px-4 rounded-md cursor-pointer flex justify-center items-center"
                  >
                    {isSubmittingRequestAccess ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      "Submit Request"
                    )}
                  </button>
                  {requestAccessError && (
                    <p className="text-red-500">{requestAccessError}</p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
