import {
  ArrowLeftIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

type EmailNotRegisteredProps = {
  email: string;
  onUseDifferentEmail: () => void;
};

export default function EmailNotRegistered({
  email,
  onUseDifferentEmail,
}: EmailNotRegisteredProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-amber-50">
        <ExclamationCircleIcon className="size-9 text-amber-600" />
      </div>

      <div role="status" aria-live="polite">
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-primary-text">
          Email Not Registered
        </h1>
        <p className="mt-3 text-sm leading-6 text-secondary-text sm:text-base">
          We could not find an account registered with{" "}
          <span className="font-medium text-primary-text">{email}</span>.
        </p>
      </div>

      <div className="mt-6 w-full rounded-sm border border-amber-100 bg-amber-50 p-4 text-left">
        <p className="text-sm leading-6 text-secondary-text">
          You can request email registration from an administrator.
        </p>
      </div>

      <button
        type="button"
        onClick={onUseDifferentEmail}
        className="mt-8 flex h-12 w-full cursor-pointer items-center justify-center rounded-sm bg-primary-accent font-medium text-surface transition hover:bg-primary-dark"
      >
        Try a Different Email
      </button>

      <Link
        href="/login"
        className="mt-8 flex items-center gap-2 font-medium text-primary-text"
      >
        <ArrowLeftIcon className="size-4" />
        Back to Login
      </Link>
    </div>
  );
}
