import skeletonStyles from "@/components/ui/skeleton.module.css";
import type { ComponentProps } from "react";

export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={`${skeletonStyles.skeleton} relative overflow-hidden rounded-md bg-border ${className ?? ""}`}
      {...props}
    />
  );
}
