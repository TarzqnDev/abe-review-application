import { useEffect, useRef } from "react";

type BodyScrollLockToken = symbol;

const activeBodyScrollLocks = new Set<BodyScrollLockToken>();
let originalBodyOverflow: string | null = null;
let appScrollContainer: HTMLElement | null = null;
let originalAppScrollContainerOverflow: string | null = null;

const acquireBodyScrollLock = (token: BodyScrollLockToken) => {
  if (activeBodyScrollLocks.has(token)) return;

  if (activeBodyScrollLocks.size === 0) {
    originalBodyOverflow = document.body.style.overflow;
    appScrollContainer = document.querySelector<HTMLElement>(
      "[data-app-scroll-container]",
    );
    originalAppScrollContainerOverflow =
      appScrollContainer?.style.overflow ?? null;
  }

  activeBodyScrollLocks.add(token);
  document.body.style.overflow = "hidden";
  if (appScrollContainer) appScrollContainer.style.overflow = "hidden";
};

const releaseBodyScrollLock = (token: BodyScrollLockToken) => {
  if (!activeBodyScrollLocks.delete(token)) return;
  if (activeBodyScrollLocks.size > 0) return;

  document.body.style.overflow = originalBodyOverflow ?? "";
  if (appScrollContainer) {
    appScrollContainer.style.overflow =
      originalAppScrollContainerOverflow ?? "";
  }
  originalBodyOverflow = null;
  appScrollContainer = null;
  originalAppScrollContainerOverflow = null;
};

export const useBodyScrollLock = (isLocked: boolean) => {
  const lockTokenRef = useRef<BodyScrollLockToken>(
    Symbol("body-scroll-lock"),
  );

  useEffect(() => {
    if (!isLocked) return;

    const lockToken = lockTokenRef.current;
    acquireBodyScrollLock(lockToken);

    return () => releaseBodyScrollLock(lockToken);
  }, [isLocked]);
};
