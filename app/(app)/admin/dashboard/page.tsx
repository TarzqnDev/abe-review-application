"use client";

import {
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useAdminDashboard } from "@/features/admin/dashboard/hooks/useAdminDashboard";

export default function AdminDashboardPage() {
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [successBannerMessage, setSuccessBannerMessage] = useState("");
  const {
    handleRegisterUser,
    handleUserInput,
    handleOpenRegisterModal,
    handleCloseRegisterModal,
    formData,
    error,
    users,
    usersError,
    isLoadingUsers,
    isRegisteringUser,
    formatDate,
    getStatusClassName,
  } = useAdminDashboard();

  const openRegisterUserModal = () => {
    handleOpenRegisterModal();
    setOpenRegisterModal(true);
  };

  const closeRegisterUserModal = () => {
    setOpenRegisterModal(false);
    handleCloseRegisterModal();
  };

  const handleRegisterUserSubmission = async (
    e: React.ChangeEvent<HTMLFormElement>,
  ) => {
    const result = await handleRegisterUser(e);

    if (!result.success) return;

    closeRegisterUserModal();
    setSuccessBannerMessage(result.message);
    setShowSuccessBanner(true);
  };

  useEffect(() => {
    if (!showSuccessBanner) return;

    const timeout = setTimeout(() => {
      setShowSuccessBanner(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [showSuccessBanner]);

  return (
    <section>
      <div
        className={`fixed left-1/2 z-60 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 transition-all duration-500 ease-out ${
          showSuccessBanner
            ? "top-12 opacity-100"
            : "-top-24 opacity-0 pointer-events-none"
        }`}
      >
        <div className="rounded-lg border border-teal-700 bg-teal-800 px-5 py-4 shadow-lg">
          <p className="text-center font-medium text-white">
            {successBannerMessage}
          </p>
        </div>
      </div>

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
            onClick={openRegisterUserModal}
            className="bg-teal-800 text-white font-semibold py-3 px-4 rounded-md cursor-pointer flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" /> Register User
          </button>

          <div
            className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-opacity duration-300 ${
              openRegisterModal
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={closeRegisterUserModal}
            ></div>

            <div
              className={`relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl transition-all duration-300 ease-out ${
                openRegisterModal
                  ? "translate-y-0 scale-100 opacity-100"
                  : "-translate-y-4 scale-95 opacity-0"
              }`}
            >
              <div>
                <button
                  onClick={closeRegisterUserModal}
                  className="absolute top-3 right-3 cursor-pointer"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <h1 className="font-semibold text-xl">Register User</h1>

                <form
                  onSubmit={handleRegisterUserSubmission}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-2">
                    <label htmlFor="fullName" className="font-medium">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="FullName"
                      value={formData.fullName}
                      onChange={handleUserInput}
                      className="border border-gray-300 w-full py-3 px-4 rounded-md"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleUserInput}
                      className="border border-gray-300 w-full py-3 px-4 rounded-md"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="startDate" className="font-medium">
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleUserInput}
                      className="border border-gray-300 w-full py-3 px-4 rounded-md"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="endDate" className="font-medium">
                      End Date
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleUserInput}
                      className="border border-gray-300 w-full py-3 px-4 rounded-md"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-teal-800 text-white font-semibold py-3 px-4 rounded-md cursor-pointer flex justify-center items-center"
                  >
                    {isRegisteringUser ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      "Register User"
                    )}
                  </button>
                  {error && <p className="text-red-500">{error}</p>}
                </form>
              </div>
            </div>
          </div>
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
            {isLoadingUsers ? (
              <tr>
                <td className="py-8 px-8 text-stone-500" colSpan={6}>
                  Loading users...
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user, index) => (
                <tr
                  key={user.user_id}
                  className={
                    index !== users.length - 1
                      ? "border-b border-gray-300"
                      : undefined
                  }
                >
                  <td className="py-3 pl-8">{user.full_name}</td>
                  <td className="py-3 pl-8">{user.email}</td>
                  <td className="py-3 pl-8">
                    <span className={getStatusClassName(user.status)}>
                      {user.status.charAt(0).toUpperCase() +
                        user.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 pl-8">{formatDate(user.start_date)}</td>
                  <td className="py-3 pl-8">{formatDate(user.end_date)}</td>
                  <td className="py-3 pl-8">
                    <button className="cursor-pointer">Edit</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-8 px-8 text-stone-500" colSpan={6}>
                  {usersError || "No users have been registered yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
