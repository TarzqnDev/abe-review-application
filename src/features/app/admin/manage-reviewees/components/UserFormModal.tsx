import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import { DeactivateRevieweeConfirmationModal } from "@/features/app/admin/manage-reviewees/components/DeactivateRevieweeConfirmationModal";
import { ProofOfPaymentSkeleton } from "@/features/app/admin/manage-reviewees/components/skeletons/ProofOfPaymentSkeleton";
import { useUserFormModal } from "@/features/app/admin/manage-reviewees/hooks/modals/useUserFormModal";
import type { Reviewee } from "@/features/app/admin/manage-reviewees/types/reviewee";

type UserFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (message: string) => Promise<void>;
  reviewee: Reviewee | null;
};

const formatStatus = (status: string) =>
  status.charAt(0).toUpperCase() + status.slice(1);

export const UserFormModal = (props: UserFormModalProps) => {
  const {
    deactivationReturnFocusRef,
    dialogRef,
    initialFocusRef,
    statusSwitchRef,
    ...modal
  } = useUserFormModal(props);
  const modalTitle = modal.isEditing ? "Edit Reviewee" : "Register User";

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 transition-opacity duration-300 ${
          props.isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onMouseDown={(event) => {
          if (
            event.target === event.currentTarget &&
            !modal.isSubmitting &&
            !modal.isDeactivationConfirmationOpen
          ) {
            props.onClose();
          }
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-form-title"
        aria-hidden={!props.isOpen || modal.isDeactivationConfirmationOpen}
        inert={!props.isOpen || modal.isDeactivationConfirmationOpen}
      >
        <div
          ref={dialogRef}
          className={`relative max-h-[calc(100vh-3rem)] w-full max-w-[525px] overflow-y-auto rounded-lg bg-surface px-9 py-10 shadow-xl transition-all duration-300 sm:px-9 ${
            props.isOpen ? "translate-y-0 scale-100" : "-translate-y-3 scale-95"
          }`}
        >
        <div className="mb-8 flex items-center justify-between">
          <h2
            id="user-form-title"
            className="text-xl font-semibold text-primary-text"
          >
            {modalTitle}
          </h2>
          <button
            type="button"
            onClick={props.onClose}
            disabled={modal.isSubmitting}
            className="cursor-pointer text-secondary-text hover:text-slate-800"
            aria-label={`Close ${modalTitle.toLowerCase()} modal`}
          >
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>

        <form onSubmit={modal.handleSubmit} className="space-y-5">
          <label className="block text-base font-medium text-primary-text">
            Full Name
            <input
              ref={initialFocusRef}
              type="text"
              value={modal.fullName}
              onChange={(event) => modal.setFullName(event.target.value)}
              autoComplete="name"
              className="mt-2 h-[50px] w-full rounded border border-border px-4 outline-none focus:border-primary-light focus:ring-2 focus:ring-teal-100"
            />
          </label>

          <label className="block text-base font-medium text-primary-text">
            Email Address
            <input
              type="email"
              value={modal.email}
              onChange={(event) => modal.setEmail(event.target.value)}
              readOnly={modal.isEditing}
              autoComplete="email"
              className={`mt-2 h-[50px] w-full rounded border border-border px-4 outline-none ${
                modal.isEditing
                  ? "cursor-not-allowed bg-secondary-bg text-secondary-text"
                  : "focus:border-primary-light focus:ring-2 focus:ring-teal-100"
              }`}
            />
          </label>

          {modal.isEditing && props.reviewee && (
            <div>
              <p className="text-base font-medium text-primary-text">Status</p>
              <div className="mt-2 flex min-h-[50px] items-center justify-between rounded border border-border bg-secondary-bg px-4">
                <span className="text-primary-text">{formatStatus(modal.status)}</span>
                {props.reviewee.status.toLowerCase() === "active" && (
                  <button
                    ref={statusSwitchRef}
                    type="button"
                    role="switch"
                    aria-checked={modal.status === "active"}
                    onClick={modal.handleStatusToggle}
                    disabled={modal.isSubmitting}
                    className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 ${
                      modal.status === "active"
                        ? "bg-primary-accent"
                        : "bg-slate-300"
                    }`}
                    aria-label="Active reviewee status"
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-surface shadow transition-transform ${
                        modal.status === "active"
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                )}
              </div>
              {props.reviewee.status.toLowerCase() === "active" && (
                <p className="mt-2 text-xs text-secondary-text">
                  Turn off the switch to deactivate this reviewee.
                </p>
              )}
            </div>
          )}

          <label className="block text-base font-medium text-primary-text">
            Mode of Review
            <span className="relative mt-2 block">
              <select
                value={modal.modeOfReview}
                onChange={(event) =>
                  modal.setModeOfReview(event.target.value)
                }
                className="h-[50px] w-full appearance-none rounded border border-border bg-surface px-4 pr-11 outline-none focus:border-primary-light focus:ring-2 focus:ring-teal-100"
              >
                <option value="online">Online</option>
                <option value="in-house">In-House</option>
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-secondary-text" />
            </span>
          </label>

          {modal.isEditing && props.reviewee ? (
            <div>
              <div className="mb-2 flex items-center justify-between gap-4">
                <p className="text-base font-medium text-primary-text">
                  Proof of Payment
                </p>
                <button
                  type="button"
                  className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
                >
                  Choose new file
                </button>
              </div>
              <div className="flex min-h-[150px] items-center justify-center overflow-hidden rounded border border-border bg-secondary-bg">
                {modal.isPaymentImageLoading ? (
                  <ProofOfPaymentSkeleton />
                ) : modal.paymentImageError ? (
                  <p className="px-6 text-center text-sm text-secondary-text">
                    {modal.paymentImageError}
                  </p>
                ) : modal.paymentImageUrl ? (
                  <div className="relative h-[150px] w-full">
                    <Image
                      src={modal.paymentImageUrl}
                      alt={`Proof of payment for ${props.reviewee.full_name}`}
                      fill
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-secondary-text">
                    No proof of payment is available.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-2 text-base font-medium text-primary-text">
                Payment
              </p>
              <div
                className={`flex min-h-[150px] flex-col items-center justify-center rounded border bg-secondary-bg px-5 py-5 text-center transition ${
                  modal.isDragging
                    ? "border-primary-light bg-teal-50"
                    : "border-border"
                }`}
                onDragEnter={(event) => {
                  event.preventDefault();
                  modal.setIsDragging(true);
                }}
                onDragOver={(event) => event.preventDefault()}
                onDragLeave={(event) => {
                  event.preventDefault();
                  modal.setIsDragging(false);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  modal.setIsDragging(false);
                  modal.selectPaymentImage(event.dataTransfer.files[0]);
                }}
              >
                {modal.paymentImage ? (
                  <p className="max-w-full truncate text-sm font-medium text-slate-700">
                    {modal.paymentImage.name}
                  </p>
                ) : (
                  <>
                    <p className="text-sm font-medium text-slate-800">
                      Drop files here
                    </p>
                    <p className="my-2 text-sm text-secondary-text">Or</p>
                  </>
                )}
                <label className="mt-1 cursor-pointer rounded bg-primary-accent px-6 py-3 text-sm font-medium text-surface hover:bg-primary-dark">
                  {modal.paymentImage ? "Change File" : "Choose File"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    onChange={(event) =>
                      modal.selectPaymentImage(event.target.files?.[0])
                    }
                  />
                </label>
                <p className="mt-2 text-xs text-slate-400">
                  PNG, JPEG, or WebP up to 5 MB
                </p>
              </div>
            </div>
          )}

          {modal.error && (
            <p role="alert" className="text-sm text-error">
              {modal.error}
            </p>
          )}
          <button
            type="submit"
            disabled={modal.isSubmitting}
            className="flex h-[50px] w-full cursor-pointer items-center justify-center rounded bg-primary-accent font-medium text-surface hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {modal.isSubmitting ? (
              <LoaderCircle
                className="h-5 w-5 animate-spin"
                aria-label={modal.isEditing ? "Saving" : "Registering"}
              />
            ) : modal.isEditing ? (
              "Save Changes"
            ) : (
              "Register User"
            )}
          </button>
        </form>
        </div>
      </div>

      <DeactivateRevieweeConfirmationModal
        isOpen={modal.isDeactivationConfirmationOpen}
        onClose={modal.cancelDeactivation}
        onConfirm={modal.confirmDeactivation}
        returnFocusRef={deactivationReturnFocusRef}
      />
    </>
  );
};
