import type { ReactNode, RefObject } from "react";

type QuizModalShellProps = {
  children: ReactNode;
  className?: string;
  dialogRef: RefObject<HTMLDivElement | null>;
  isInert?: boolean;
  isOpen: boolean;
  isVisible: boolean;
  labelledBy: string;
  onBackdropMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  overlayClassName?: string;
  zIndexClassName?: string;
};

export default function QuizModalShell({
  children,
  className = "",
  dialogRef,
  isInert = false,
  isOpen,
  isVisible,
  labelledBy,
  onBackdropMouseDown,
  overlayClassName = "bg-slate-950/45",
  zIndexClassName = "z-50",
}: QuizModalShellProps) {
  return (
    <div
      className={`fixed inset-0 ${zIndexClassName} ${overlayClassName} flex items-center justify-center overflow-y-auto px-4 py-4 transition-opacity duration-300 motion-reduce:transition-none sm:py-6 ${
        isVisible
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      onMouseDown={onBackdropMouseDown}
      role="dialog"
      aria-modal={isInert ? undefined : "true"}
      aria-labelledby={labelledBy}
      aria-hidden={!isOpen || isInert}
      inert={isInert ? true : undefined}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={`relative w-full rounded-lg bg-white shadow-xl transition-all duration-300 ease-out outline-none motion-reduce:transform-none motion-reduce:transition-none ${
          isVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "-translate-y-4 scale-95 opacity-0"
        } ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
