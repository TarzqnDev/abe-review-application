import { XMarkIcon } from "@heroicons/react/24/outline";
import { LoaderCircle } from "lucide-react";
import { useResendInvitationConfirmationModal } from "@/features/app/admin/reviewees/hooks/modals/useResendInvitationConfirmationModal";
import type { Reviewee } from "@/features/app/admin/reviewees/types/reviewee";

type ResendInvitationConfirmationModalProps = {
  onClose: () => void;
  onNotice: (message: string) => void;
  reviewee: Reviewee | null;
};

export const ResendInvitationConfirmationModal = (
  props: ResendInvitationConfirmationModalProps,
) => {
  const { cancelButtonRef, dialogRef, ...modal } =
    useResendInvitationConfirmationModal(props);
  const isOpen = props.reviewee !== null;

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center px-4 transition-opacity duration-300 ${
        isOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="resend-invitation-title"
      aria-describedby="resend-invitation-description"
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        onClick={modal.handleClose}
        className="absolute inset-0 cursor-default bg-slate-950/45"
        aria-label="Close resend invitation confirmation"
        tabIndex={-1}
      />

      <form
        ref={dialogRef}
        inert={!isOpen}
        onSubmit={modal.handleResend}
        className={`relative w-full max-w-[430px] rounded-md bg-surface p-7 shadow-xl transition-all duration-300 ease-out ${
          isOpen
            ? "translate-y-0 scale-100 opacity-100"
            : "-translate-y-4 scale-95 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={modal.handleClose}
          disabled={modal.isResending}
          className="absolute top-6 right-6 cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Close resend invitation confirmation"
        >
          <XMarkIcon className="h-6 w-6 text-secondary-text" />
        </button>

        <div className="pr-9">
          <h2
            id="resend-invitation-title"
            className="text-xl font-semibold text-primary-text"
          >
            Resend Email Invitation
          </h2>
          <p
            id="resend-invitation-description"
            className="mt-3 text-sm leading-6 text-secondary-text"
          >
            Are you sure you want to resend the email invitation to this
            reviewee?
          </p>
        </div>

        {props.reviewee && (
          <div className="mt-5 rounded border border-border bg-secondary-bg p-4">
            <p className="text-sm font-medium text-primary-text">
              {props.reviewee.full_name}
            </p>
            <p className="mt-1 text-sm text-secondary-text">
              {props.reviewee.email}
            </p>
          </div>
        )}

        {modal.error && (
          <p role="alert" className="mt-4 text-sm text-error">
            {modal.error}
          </p>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={modal.handleClose}
            disabled={modal.isResending}
            className="h-11 cursor-pointer rounded border border-border bg-surface text-sm font-semibold text-primary-text transition-colors hover:border-primary-accent hover:text-primary-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={modal.isResending}
            className="flex h-11 cursor-pointer items-center justify-center rounded bg-primary-accent text-sm font-semibold text-surface transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {modal.isResending ? (
              <LoaderCircle
                className="h-5 w-5 animate-spin"
                aria-label="Resending invitation"
              />
            ) : (
              "Resend Invitation"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
