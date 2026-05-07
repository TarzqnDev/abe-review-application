"use client";

import Image from "next/image";
import authBackground from "@/public/authBackground.jpg";
import { useSignup } from "@/features/signup/hooks/useSignup";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/features/auth/providers/AuthProvider";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { user } = useAuth();
  const { handleSignup, handleUserInput, formData, error, hasInviteSession } =
    useSignup();

  return (
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
            <div className="border border-red-200 bg-red-50 text-red-700 rounded-md p-4">
              Your invite link is invalid or has expired.
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
                  <button className="bg-teal-800 text-white font-semibold w-full py-3 rounded-md cursor-pointer">
                    Complete Signup
                  </button>
                </div>
                {error && <p className="text-red-500">{error}</p>}
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
