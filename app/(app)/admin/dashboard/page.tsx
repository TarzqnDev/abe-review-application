"use client";

import {
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useAdminDashboard } from "@/features/admin/dashboard/hooks/useAdminDashboard";

const ITEMS_PER_PAGE = 10;

type StatusFilter = "all" | "active" | "pending";
type SortOption = "newest" | "oldest";

export default function AdminDashboardPage() {
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [openFilterMenu, setOpenFilterMenu] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [successBannerMessage, setSuccessBannerMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);
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

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let result = users;

    // Filter by search query
    if (searchQuery.trim()) {
      result = result.filter((user) =>
        user.full_name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((user) => user.status === statusFilter);
    }

    // Sort by date
    result = result.sort((a, b) => {
      const dateA = new Date(a.start_date).getTime();
      const dateB = new Date(b.start_date).getTime();

      if (sortOption === "newest") {
        return dateB - dateA; // Most recent first
      } else {
        return dateA - dateB; // Oldest first
      }
    });

    return result;
  }, [users, searchQuery, statusFilter, sortOption]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortOption]);

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

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const toggleFilterMenu = () => {
    setOpenFilterMenu(!openFilterMenu);
  };

  const hasActiveFilters = statusFilter !== "all" || sortOption !== "newest";

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

      <div className="flex justify-between mb-6 gap-4">
        <div className="relative flex-1 ">
          <input
            type="text"
            placeholder="Search User by Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 w-125 py-3 pl-10 pr-4 rounded-md"
          />

          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex gap-2">
          {/* Filter Button */}
          <div className="relative">
            <button
              onClick={toggleFilterMenu}
              className={`flex items-center gap-2 py-3 px-4 rounded-md font-semibold transition-colors cursor-pointer ${
                hasActiveFilters
                  ? "bg-teal-100 text-teal-800 border border-teal-300"
                  : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
              }`}
            >
              <FunnelIcon className="h-5 w-5" />
              Filter
            </button>

            {/* Filter Dropdown Menu */}
            <div
              className={`absolute right-0 top-full mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-40 transition-all duration-200 ${
                openFilterMenu
                  ? "opacity-100 visible"
                  : "opacity-0 invisible pointer-events-none"
              }`}
            >
              <div className="p-4">
                {/* Status Filter */}
                <div className="mb-4">
                  <h3 className="font-semibold text-sm text-gray-700 mb-3">
                    Status
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="all"
                        checked={statusFilter === "all"}
                        onChange={(e) =>
                          setStatusFilter(e.target.value as StatusFilter)
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-600">All Users</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="active"
                        checked={statusFilter === "active"}
                        onChange={(e) =>
                          setStatusFilter(e.target.value as StatusFilter)
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-600">Active</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="pending"
                        checked={statusFilter === "pending"}
                        onChange={(e) =>
                          setStatusFilter(e.target.value as StatusFilter)
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-600">Pending</span>
                    </label>
                  </div>
                </div>

                {/* Sort Option */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-sm text-gray-700 mb-3">
                    Sort by Date Joined
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="sort"
                        value="newest"
                        checked={sortOption === "newest"}
                        onChange={(e) =>
                          setSortOption(e.target.value as SortOption)
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-600">
                        Latest First
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="sort"
                        value="oldest"
                        checked={sortOption === "oldest"}
                        onChange={(e) =>
                          setSortOption(e.target.value as SortOption)
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-600">
                        Oldest First
                      </span>
                    </label>
                  </div>
                </div>

                {/* Reset Filters */}
                {hasActiveFilters && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <button
                      onClick={() => {
                        setStatusFilter("all");
                        setSortOption("newest");
                      }}
                      className="w-full text-sm text-teal-800 font-medium hover:bg-teal-50 py-2 rounded transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Register Button */}
          <button
            onClick={openRegisterUserModal}
            className="bg-teal-800 text-white font-semibold py-3 px-4 rounded-md cursor-pointer flex items-center whitespace-nowrap hover:bg-teal-900 transition-colors"
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

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mb-4 p-3 bg-teal-50 border border-teal-200 rounded-lg flex items-center justify-between">
          <div className="text-sm text-teal-800">
            <span className="font-medium">Active filters:</span>
            {statusFilter !== "all" && (
              <span className="ml-2">
                Status: <strong>{statusFilter}</strong>
              </span>
            )}
            {sortOption !== "newest" && (
              <span className="ml-2">
                Sorted: <strong>{sortOption}</strong>
              </span>
            )}
          </div>
          <button
            onClick={() => {
              setStatusFilter("all");
              setSortOption("newest");
            }}
            className="text-xs text-teal-700 font-medium hover:text-teal-900"
          >
            Clear All
          </button>
        </div>
      )}

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
            ) : paginatedUsers.length > 0 ? (
              paginatedUsers.map((user, index) => (
                <tr
                  key={user.user_id}
                  className={
                    index !== paginatedUsers.length - 1
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
                    <button className="cursor-pointer hover:text-teal-800 transition-colors">
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-8 px-8 text-stone-500" colSpan={6}>
                  {usersError ||
                    (searchQuery
                      ? "No users found matching your search."
                      : statusFilter !== "all"
                        ? `No ${statusFilter} users found.`
                        : "No users have been registered yet.")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!isLoadingUsers && filteredUsers.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-stone-600">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length}{" "}
            users
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="flex items-center justify-center h-10 w-10 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-10 w-10 rounded-md font-medium transition-colors ${
                      currentPage === page
                        ? "bg-teal-800 text-white"
                        : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center h-10 w-10 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
