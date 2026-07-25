import { XMarkIcon } from "@heroicons/react/24/outline";
import type { RefObject } from "react";
import { useDeactivateRevieweeConfirmationModal } from "@/features/app/admin/reviewees/hooks/modals/useDeactivateRevieweeConfirmationModal";

type DeactivateRevieweeConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
};

export const DeactivateRevieweeConfirmationModal = (
  props: DeactivateRevieweeConfirmationModalProps,
) => {
  const { cancelButtonRef, dialogRef, handleClose, handleConfirm } =
    useDeactivateRevieweeConfirmationModal(props);

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center px-4 transition-opacity duration-300 ${
        props.isOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="deactivate-reviewee-title"
      aria-describedby="deactivate-reviewee-description"
      aria-hidden={!props.isOpen}
    >
      <button
        type="button"
        onClick={handleClose}
        className="absolute inset-0 cursor-default bg-slate-950/45"
        aria-label="Close deactivation confirmation"
        tabIndex={-1}
      />

      <div
        ref={dialogRef}
        inert={!props.isOpen}
        className={`relative w-full max-w-[430px] rounded-md bg-surface p-7 shadow-xl transition-all duration-300 ease-out ${
          props.isOpen
            ? "translate-y-0 scale-100 opacity-100"
            : "-translate-y-4 scale-95 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-6 right-6 cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent"
          aria-label="Close deactivation confirmation"
        >
          <XMarkIcon className="h-6 w-6 text-secondary-text" />
        </button>

        <div className="pr-9">
          <h2
            id="deactivate-reviewee-title"
            className="text-xl font-semibold text-primary-text"
          >
            Deactivate Reviewee
          </h2>
          <p
            id="deactivate-reviewee-description"
            className="mt-3 text-sm leading-6 text-secondary-text"
          >
            Are you sure you want to deactivate this reviewee? Once
            deactivated, this reviewee will no longer be able to access or use
            their account.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={handleClose}
            className="h-11 cursor-pointer rounded border border-border bg-surface text-sm font-semibold text-primary-text transition-colors hover:border-primary-accent hover:text-primary-accent"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="h-11 cursor-pointer rounded bg-error text-sm font-semibold text-surface transition-opacity hover:opacity-90"
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );
};
