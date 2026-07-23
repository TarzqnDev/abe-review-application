"use client";

import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { ProofOfPaymentModal } from "@/features/app/admin/reviewees/components/ProofOfPaymentModal";
import { RegisterUserModal } from "@/features/app/admin/reviewees/components/RegisterUserModal";
import { RevieweesPagination } from "@/features/app/admin/reviewees/components/RevieweesPagination";
import { RevieweesTable } from "@/features/app/admin/reviewees/components/RevieweesTable";
import { useAdminReviewees } from "@/features/app/admin/reviewees/hooks/useAdminReviewees";

export default function AdminRevieweesPage() {
  const reviewees = useAdminReviewees();

  return (
    <section>
      <div
        className={`fixed left-1/2 z-60 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 transition-all duration-500 ${
          reviewees.successMessage
            ? "top-8 opacity-100"
            : "pointer-events-none -top-24 opacity-0"
        }`}
      >
        <p className="rounded-lg bg-primary-dark px-5 py-4 text-center font-medium text-surface shadow-lg">
          {reviewees.successMessage}
        </p>
      </div>

      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-primary-text">
          Manage Reviewees
        </h1>
        <p className="mt-1 text-base text-secondary-text">
          Register and manage student accounts
        </p>
      </div>

      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={reviewees.openRegisterModal}
          className="inline-flex w-fit cursor-pointer items-center gap-1.5 rounded bg-primary-accent px-5 py-3 text-sm font-medium text-surface transition-colors hover:bg-primary-dark"
        >
          <PlusIcon className="h-4 w-4" />
          Register User
        </button>

        <label className="relative block w-full sm:max-w-[275px]">
          <span className="sr-only">Search user</span>
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={reviewees.searchQuery}
            onChange={(event) => reviewees.setSearchQuery(event.target.value)}
            placeholder="Search user"
            className="h-10 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-sm outline-none transition focus:border-primary-light focus:ring-2 focus:ring-teal-100"
          />
        </label>
      </div>

      <RevieweesTable
        users={reviewees.paginatedUsers}
        isLoading={reviewees.isLoading}
        emptyMessage={reviewees.emptyMessage}
        onViewPayment={reviewees.openPaymentModal}
      />

      <RevieweesPagination
        currentPage={reviewees.currentPage}
        totalPages={reviewees.totalPages}
        firstItem={reviewees.firstItem}
        lastItem={reviewees.lastItem}
        totalItems={reviewees.filteredUsers.length}
        onPageChange={reviewees.setCurrentPage}
      />

      {/* Modals */}
      <RegisterUserModal
        isOpen={reviewees.isRegisterModalOpen}
        onClose={reviewees.closeRegisterModal}
        onRegistered={reviewees.handleRegistered}
      />
      <ProofOfPaymentModal
        isOpen={reviewees.isPaymentModalOpen}
        imagePath={reviewees.selectedPaymentPath}
        revieweeName={reviewees.selectedRevieweeName}
        onClose={reviewees.closePaymentModal}
      />
    </section>
  );
}
