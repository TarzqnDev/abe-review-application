"use client";

import type { AppRole } from "@/features/app/layout/types/appRole";
import NavigationLinks from "@/features/app/navigation/components/NavigationLinks";
import { getNavigationLinks } from "@/features/app/navigation/config/navigationLinks";
import { useMobileNavigation } from "@/features/app/navbar/hooks/useMobileNavigation";
import {
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { LoaderCircle } from "lucide-react";

type MobileNavigationProps = {
  email: string;
  isLoggingOut: boolean;
  onLogout: () => Promise<void>;
  role: AppRole | null;
  roleLabel: string;
};

export default function MobileNavigation({
  email,
  isLoggingOut,
  onLogout,
  role,
  roleLabel,
}: MobileNavigationProps) {
  const {
    dialogRef,
    handleBackdropMouseDown,
    handleClose,
    handleToggle,
    isModalVisible,
    isOpen,
    pathname,
    triggerRef,
  } = useMobileNavigation();
  const links = getNavigationLinks(role);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-md text-primary-text transition-colors hover:bg-teal-50 hover:text-primary-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent md:hidden"
      >
        {isOpen ? (
          <XMarkIcon className="h-7 w-7" />
        ) : (
          <Bars3Icon className="h-7 w-7" />
        )}
      </button>

      <div
        className={`fixed inset-x-0 bottom-0 top-[100px] z-30 bg-slate-950/35 transition-opacity duration-300 motion-reduce:transition-none md:hidden ${
          isModalVisible
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onMouseDown={handleBackdropMouseDown}
        aria-hidden={!isOpen}
      >
        <div
          ref={dialogRef}
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Account and navigation menu"
          tabIndex={-1}
          inert={!isOpen ? true : undefined}
          className={`ml-auto flex h-full w-[min(88vw,360px)] flex-col border-l border-border bg-surface px-5 py-6 shadow-xl outline-none transition-transform duration-300 ease-out motion-reduce:transform-none motion-reduce:transition-none ${
            isModalVisible ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center gap-3 border-b border-border pb-5">
            <UserCircleIcon className="h-11 w-11 shrink-0 text-secondary-text" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-primary-text">
                {email}
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-secondary-text">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-accent" />
                {roleLabel}
              </p>
            </div>
          </div>

          <nav aria-label="Main navigation" className="mt-5 flex flex-col gap-1">
            <NavigationLinks
              links={links}
              pathname={pathname}
              onNavigate={handleClose}
            />
          </nav>

          <button
            type="button"
            onClick={onLogout}
            disabled={isLoggingOut}
            className="mt-auto flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded bg-primary-accent px-4 text-sm font-medium text-surface transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoggingOut ? (
              <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
            ) : (
              <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
            )}
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </>
  );
}
