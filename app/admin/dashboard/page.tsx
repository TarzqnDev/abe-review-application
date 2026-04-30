"use client";

import { useAuth } from "@/features/auth/providers/AuthProvider";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const [openRegisterModal, setOpenRegisterModal] = useState(false);

  return (
    <section>
      <div className="mb-6">
        <h1 className="font-semibold text-2xl">Admin Dashboard</h1>
        <p className="text-lg text-stone-600">
          Manage users for the learning platform.
        </p>
      </div>

      <div className="flex justify-between mb-6">
        <div className="relative w-100">
          <input
            type="text"
            placeholder="Search User"
            className="border border-gray-300 w-full py-3 pl-10 pr-4 rounded-md"
          />

          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div>
          <button
            onClick={() => setOpenRegisterModal(true)}
            className="bg-teal-800 text-white font-semibold py-3 px-4 rounded-md cursor-pointer flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" /> Register User
          </button>

          {openRegisterModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setOpenRegisterModal(false)}
              ></div>

              <div className="relative bg-white rounded-lg w-125 p-6">
                <div>
                  <button
                    onClick={() => setOpenRegisterModal(false)}
                    className="absolute top-3 right-3 cursor-pointer"
                  >
                    <XMarkIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  <h1 className="font-semibold text-xl">Register User</h1>

                  <form className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="font-medium">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="FullName"
                        className="border border-gray-300 w-full py-3 px-4 rounded-md"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="font-medium">
                        Email Address
                      </label>
                      <input
                        type="text"
                        placeholder="Email Address"
                        className="border border-gray-300 w-full py-3 px-4 rounded-md"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="font-medium">
                        End Date
                      </label>
                      <input
                        type="text"
                        placeholder="End Date"
                        className="border border-gray-300 w-full py-3 px-4 rounded-md"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-teal-800 text-white font-semibold py-3 px-4 rounded-md cursor-pointer"
                    >
                      Register User
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-gray-300 overflow-hidden shadow-sm">
        <table className="w-full bg-white">
          <thead>
            <tr className="border-b border-gray-300 text-stone-400">
              <th className="text-left py-3 pl-8 font-medium">NAME</th>
              <th className="text-left py-3 pl-8 font-medium">EMAIL</th>
              <th className="text-left py-3 pl-8 font-medium">STATUS</th>
              <th className="text-left py-3 pl-8 font-medium">JOINED</th>
              <th className="text-left py-3 pl-8 font-medium">END</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="py-3 pl-8">Mark Joseph M. Ante</td>
              <td className="py-3 pl-8">mark@example.com</td>
              <td className="py-3 pl-8">
                <span className="bg-teal-800 text-white text-sm font-medium px-4 py-1 rounded-full">
                  Active
                </span>
              </td>
              <td className="py-3 pl-8">23/04/2026</td>
              <td className="py-3 pl-8">14/06/2026</td>
              <td className="py-3 pl-8">Edit</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
