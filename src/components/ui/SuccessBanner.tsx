type SuccessBannerProps = {
  message: string;
  show: boolean;
};

export default function SuccessBanner({
  message,
  show,
}: SuccessBannerProps) {
  return (
    <div
      className={`fixed left-1/2 z-[90] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 transition-all duration-500 ease-out ${
        show
          ? "top-8 opacity-100"
          : "pointer-events-none -top-24 opacity-0"
      }`}
      role="status"
      aria-live="polite"
    >
      <p className="rounded-lg border-2 border-primary-accent bg-success-bg px-5 py-4 text-center font-semibold text-primary-accent">
        {message}
      </p>
    </div>
  );
}
