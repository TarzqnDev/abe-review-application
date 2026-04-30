"use client";

import Image from "next/image";
import authBackground from "@/public/authBackground.jpg";
import { useLogin } from "@/features/login/hooks/useLogin";

export default function LoginPage() {
  const { handleLogin, handleUserInput, formData, error } = useLogin();

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
              Welcome Back!
            </h1>
            <p>Login your account to start your review.</p>
          </div>

          <div>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="font-medium">
                  Email Address
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  defaultValue={formData.email}
                  onChange={handleUserInput}
                  placeholder="Email Address"
                  className="border border-gray-300 w-full py-3 px-4 rounded-md"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="font-medium ">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  defaultValue={formData.password}
                  onChange={handleUserInput}
                  placeholder="Password"
                  className="border border-gray-300 w-full py-3 px-4 rounded-md"
                />
              </div>

              {error && <p className="text-red-500">{error}</p>}

              <div className="flex justify-end">
                <p className="text-teal-600 font-medium">Forgot Password?</p>
              </div>

              <div>
                <button className="bg-teal-800 text-white font-semibold w-full py-3 rounded-md cursor-pointer">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
