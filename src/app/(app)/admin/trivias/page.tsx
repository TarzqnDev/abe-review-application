export default function AdminTriviasPage() {
  return (
    <section>
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-slate-950">ABE Trivia</h1>
        <p className="mt-1 text-base text-slate-500">
          Create daily ABE trivia that appear on student dashboards
        </p>
      </div>

      <button
        type="button"
        className="inline-flex h-10 min-w-[150px] cursor-pointer items-center justify-center rounded bg-teal-600 px-5 text-sm font-medium text-white transition-colors hover:bg-teal-700"
      >
        + Add Trivia
      </button>
    </section>
  );
}
