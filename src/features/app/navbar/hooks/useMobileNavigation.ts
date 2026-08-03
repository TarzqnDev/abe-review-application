"use client";

import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useModalAnimation } from "@/hooks/useModalAnimation";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const useMobileNavigation = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousPathnameRef = useRef(pathname);
  const { isModalVisible } = useModalAnimation(isOpen);

  useBodyScrollLock(isOpen);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleToggle = () => {
    setIsOpen((open) => !open);
  };

  const handleBackdropMouseDown: React.MouseEventHandler<HTMLDivElement> = (
    event,
  ) => {
    if (event.target === event.currentTarget) handleClose();
  };

  useEffect(() => {
    if (previousPathnameRef.current === pathname) return;

    previousPathnameRef.current = pathname;
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const triggerButton = triggerRef.current;
    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    const desktopMediaQuery = window.matchMedia("(min-width: 768px)");
    const handleDesktopBreakpoint = (event: MediaQueryListEvent) => {
      if (event.matches) handleClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    desktopMediaQuery.addEventListener("change", handleDesktopBreakpoint);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      desktopMediaQuery.removeEventListener("change", handleDesktopBreakpoint);
      triggerButton?.focus();
    };
  }, [isOpen]);

  return {
    dialogRef,
    handleBackdropMouseDown,
    handleClose,
    handleToggle,
    isModalVisible,
    isOpen,
    pathname,
    triggerRef,
  };
};
