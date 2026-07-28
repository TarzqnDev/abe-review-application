"use client";

import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { LoaderCircle } from "lucide-react";
import { ProofOfPaymentModal } from "@/features/app/admin/manage-reviewees/components/ProofOfPaymentModal";
import { ResendInvitationConfirmationModal } from "@/features/app/admin/manage-reviewees/components/ResendInvitationConfirmationModal";
import { RevieweesPagination } from "@/features/app/admin/manage-reviewees/components/RevieweesPagination";
import { RevieweesTable } from "@/features/app/admin/manage-reviewees/components/RevieweesTable";
import { UserFormModal } from "@/features/app/admin/manage-reviewees/components/UserFormModal";
import { useAdminManageReviewees } from "@/features/app/admin/manage-reviewees/hooks/useAdminManageReviewees";

export default function AdminRevieweesPage() {
  const reviewees = useAdminManageReviewees();

  return (
    <section>
      <div
        className={`fixed left-1/2 z-60 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 transition-all duration-500 ${
          reviewees.noticeMessage
            ? "top-8 opacity-100"
            : "pointer-events-none -top-24 opacity-0"
        }`}
      >
        <p className="rounded-lg bg-primary-dark px-5 py-4 text-center font-medium text-surface shadow-lg">
          {reviewees.noticeMessage}
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

        <div className="flex w-full items-center gap-2 sm:max-w-[323px]">
          <button
            type="button"
            onClick={reviewees.refreshUsers}
            disabled={reviewees.isLoading}
            aria-label="Refresh reviewees"
            title="Refresh reviewees"
            className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-secondary-text transition-colors hover:border-slate-300 hover:bg-secondary-bg focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {reviewees.isLoading ? (
              <LoaderCircle
                className="h-5 w-5 animate-spin"
                aria-label="Loading reviewees"
              />
            ) : (
              <ArrowPathIcon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          <label className="relative block min-w-0 flex-1">
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
      </div>

      <RevieweesTable
        users={reviewees.paginatedUsers}
        isLoading={reviewees.isLoading}
        emptyMessage={reviewees.emptyMessage}
        onEdit={reviewees.openEditModal}
        onResendInvitation={reviewees.openResendInvitationModal}
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
      <UserFormModal
        isOpen={reviewees.isUserFormModalOpen}
        onClose={reviewees.closeUserFormModal}
        onSaved={reviewees.handleUserSaved}
        reviewee={reviewees.revieweeToEdit}
      />
      <ResendInvitationConfirmationModal
        reviewee={reviewees.revieweeToResend}
        onClose={reviewees.closeResendInvitationModal}
        onNotice={reviewees.showNotice}
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
