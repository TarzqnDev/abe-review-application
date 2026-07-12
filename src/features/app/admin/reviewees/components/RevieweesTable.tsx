import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { RevieweesTableSkeleton } from "@/features/app/admin/reviewees/components/skeletons/RevieweesTableSkeleton";
import type { Reviewee } from "@/features/app/admin/reviewees/types/reviewee";

type RevieweesTableProps = {
  emptyMessage: string;
  isLoading: boolean;
  onViewPayment: (user: Reviewee) => void;
  users: Reviewee[];
};

const formatDate = (date: string) => {
  const parsedDate = new Date(date.includes("T") ? date : `${date}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return date;
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(parsedDate);
};

const formatMode = (mode: string) => mode.toLowerCase() === "in-house" ? "In-House" : "Online";

export const RevieweesTable = ({ emptyMessage, isLoading, onViewPayment, users }: RevieweesTableProps) => (
  <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
    <table className="w-full min-w-[880px] text-sm">
      <thead>
        <tr className="border-b border-slate-200 text-slate-500">
          <th className="px-5 py-4 text-left font-medium">Name</th>
          <th className="px-5 py-4 text-left font-medium">Email Address</th>
          <th className="px-4 py-4 text-left font-medium">Status</th>
          <th className="px-4 py-4 text-left font-medium">Mode</th>
          <th className="px-4 py-4 text-left font-medium">Date Joined</th>
          <th className="px-4 py-4 text-left font-medium">Payment</th>
          <th className="px-4 py-4 text-left font-medium">Action</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <RevieweesTableSkeleton />
        ) : users.length ? users.map((user) => (
          <tr key={user.user_id} className="border-b border-slate-200 last:border-b-0">
            <td className="whitespace-nowrap px-5 py-3 font-medium text-slate-900">{user.full_name}</td>
            <td className="px-5 py-3 text-slate-800">{user.email}</td>
            <td className="px-4 py-3">
              <span className={`inline-flex min-w-[60px] justify-center rounded-full px-3 py-1 text-[10px] font-medium ${user.status.toLowerCase() === "active" ? "bg-teal-50 text-teal-600" : "bg-amber-50 text-amber-500"}`}>
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </span>
            </td>
            <td className="whitespace-nowrap px-4 py-3">{formatMode(user.mode_of_review)}</td>
            <td className="whitespace-nowrap px-4 py-3">{formatDate(user.start_date)}</td>
            <td className="px-4 py-3">
              {user.payment_image_path ? (
                <button type="button" onClick={() => onViewPayment(user)} className="inline-flex cursor-pointer items-center gap-1 text-blue-600 underline underline-offset-2 hover:text-blue-800">
                  <DocumentTextIcon className="h-4 w-4" /> View
                </button>
              ) : <span className="text-slate-400">Unavailable</span>}
            </td>
            <td className="px-4 py-3"><button type="button" className="cursor-pointer hover:text-teal-700">Edit</button></td>
          </tr>
        )) : (
          <tr><td colSpan={7} className="px-5 py-10 text-center text-slate-500">{emptyMessage}</td></tr>
        )}
      </tbody>
    </table>
  </div>
);
