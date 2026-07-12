import { Skeleton } from "@/components/ui/skeleton";

export const RevieweesTableSkeleton = () => (
  <tr>
    <td className="px-5 py-4">
      <span className="sr-only" role="status">
        Loading reviewees...
      </span>
      <Skeleton className="h-4 w-32" />
    </td>
    <td className="px-5 py-4">
      <Skeleton className="h-4 w-44" />
    </td>
    <td className="px-4 py-4">
      <Skeleton className="h-6 w-16 rounded-full" />
    </td>
    <td className="px-4 py-4">
      <Skeleton className="h-4 w-16" />
    </td>
    <td className="px-4 py-4">
      <Skeleton className="h-4 w-28" />
    </td>
    <td className="px-4 py-4">
      <Skeleton className="h-4 w-14" />
    </td>
    <td className="px-4 py-4">
      <Skeleton className="h-4 w-10" />
    </td>
  </tr>
);
