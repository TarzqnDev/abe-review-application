type AuthenticationSuccessBannerProps = {
  message: string;
  show: boolean;
};

export default function AuthenticationSuccessBanner({
  message,
  show,
}: AuthenticationSuccessBannerProps) {
  return (
    <div
      className={`fixed left-1/2 z-[90] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 transition-all duration-500 ${
        show
          ? "top-8 opacity-100"
          : "pointer-events-none -top-24 opacity-0"
      }`}
      role="status"
      aria-live="polite"
    >
      <p className="rounded-lg bg-primary-dark px-5 py-4 text-center font-medium text-surface shadow-lg">
        {message}
      </p>
    </div>
  );
}
