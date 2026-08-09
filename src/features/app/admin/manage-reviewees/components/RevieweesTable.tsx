import {
  ArrowPathIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { RevieweesTableSkeleton } from "@/features/app/admin/manage-reviewees/components/skeletons/RevieweesTableSkeleton";
import { useInvitationCooldowns } from "@/features/app/admin/manage-reviewees/hooks/useInvitationCooldowns";
import { useResendCooldownTooltip } from "@/features/app/admin/manage-reviewees/hooks/useResendCooldownTooltip";
import type { Reviewee } from "@/features/app/admin/manage-reviewees/types/reviewee";
import { formatInvitationCooldown } from "@/features/app/admin/manage-reviewees/utils/invitationCooldown";

type RevieweesTableProps = {
  emptyMessage: string;
  isLoading: boolean;
  onEdit: (user: Reviewee) => void;
  onResendInvitation: (user: Reviewee) => void;
  users: Reviewee[];
};

const formatDate = (date: string) => {
  const parsedDate = new Date(date.includes("T") ? date : `${date}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return date;
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(parsedDate);
};

const formatMode = (mode: string) => mode.toLowerCase() === "in-house" ? "In-House" : "Online";

export const RevieweesTable = ({ emptyMessage, isLoading, onEdit, onResendInvitation, users }: RevieweesTableProps) => {
  const currentTime = useInvitationCooldowns(users);
  const { showCooldownTooltip, tooltip } = useResendCooldownTooltip();

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full min-w-[880px] text-sm">
          <thead>
            <tr className="border-b border-border text-secondary-text">
              <th className="px-5 py-4 text-left font-medium">Name</th>
              <th className="px-5 py-4 text-left font-medium">Email Address</th>
              <th className="px-4 py-4 text-left font-medium">Status</th>
              <th className="px-4 py-4 text-left font-medium">Mode</th>
              <th className="px-4 py-4 text-left font-medium">Date Joined</th>
              <th className="px-4 py-4 text-left font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <RevieweesTableSkeleton />
            ) : users.length ? users.map((user) => {
              const normalizedStatus = user.status.toLowerCase();
              const resendAvailableTime = user.resend_available_at
                ? new Date(user.resend_available_at).getTime()
                : 0;
              const remainingCooldownSeconds = Math.max(
                0,
                Math.ceil((resendAvailableTime - currentTime) / 1000),
              );
              const isPending = normalizedStatus === "pending";
              const hasResendCooldown = isPending && remainingCooldownSeconds > 0;
              const isResendDisabled = !isPending;
              const resendTooltip = !isPending
                ? "Only pending reviewees can receive another email invitation."
                : hasResendCooldown
                  ? `Please wait ${formatInvitationCooldown(remainingCooldownSeconds)} before resending the email invitation.`
                  : "Resend Email Invitation";

              return (
                <tr key={user.user_id} className="border-b border-border last:border-b-0">
                  <td className="whitespace-nowrap px-5 py-3 font-medium text-primary-text">{user.full_name}</td>
                  <td className="px-5 py-3 text-slate-800">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex min-w-[70px] justify-center rounded-full px-3 py-1 text-xs font-medium ${
                      normalizedStatus === "active"
                        ? "bg-teal-50 text-primary-accent"
                        : normalizedStatus === "pending"
                          ? "bg-amber-50 text-warning"
                          : "bg-slate-200 text-secondary-text"
                    }`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{formatMode(user.mode_of_review)}</td>
                  <td className="whitespace-nowrap px-4 py-3">{formatDate(user.start_date)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onEdit(user)}
                        className="inline-flex cursor-pointer items-center gap-1.5 text-primary-text hover:text-primary-dark"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          if (hasResendCooldown) {
                            showCooldownTooltip(
                              event.currentTarget,
                              remainingCooldownSeconds,
                            );
                            return;
                          }

                          onResendInvitation(user);
                        }}
                        disabled={isResendDisabled}
                        aria-disabled={hasResendCooldown}
                        title={resendTooltip}
                        className={`inline-flex items-center gap-1.5 text-primary-accent hover:text-primary-dark disabled:cursor-not-allowed disabled:text-secondary-text ${
                          hasResendCooldown
                            ? "cursor-not-allowed text-secondary-text hover:text-secondary-text"
                            : "cursor-pointer"
                        }`}
                      >
                        <ArrowPathIcon className="h-4 w-4" />
                        Resend
                      </button>
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-secondary-text">{emptyMessage}</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {tooltip && (
        <div
          className={`pointer-events-none fixed z-[90] w-64 -translate-x-1/2 -translate-y-full rounded border border-primary-accent bg-surface px-3 py-2 text-center text-xs font-medium text-primary-text shadow-lg transition-opacity duration-300 ${
            tooltip.isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{
            left: tooltip.left,
            top: tooltip.top,
          }}
        >
          {tooltip.message}
        </div>
      )}
    </>
  );
};
