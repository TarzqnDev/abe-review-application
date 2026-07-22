type TriviaSuccessBannerProps = {
  message: string;
};

export default function TriviaSuccessBanner({
  message,
}: TriviaSuccessBannerProps) {
  return (
    <div
      className={`fixed left-1/2 z-[90] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 transition-all duration-500 ${
        message
          ? "top-8 opacity-100"
          : "pointer-events-none -top-24 opacity-0"
      }`}
      role="status"
      aria-live="polite"
    >
      <p className="rounded-lg bg-teal-700 px-5 py-4 text-center font-medium text-white shadow-lg">
        {message}
      </p>
    </div>
  );
}
