export type TaskViewMode = "cards" | "table";

export function TaskViewToggle({
  mode,
  onChange
}: {
  mode: TaskViewMode;
  onChange: (mode: TaskViewMode) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
      <button
        type="button"
        className={`rounded-md px-3 py-1.5 text-sm ${
          mode === "cards" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"
        }`}
        onClick={() => onChange("cards")}
        aria-pressed={mode === "cards"}
      >
        Cards
      </button>
      <button
        type="button"
        className={`rounded-md px-3 py-1.5 text-sm ${
          mode === "table" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"
        }`}
        onClick={() => onChange("table")}
        aria-pressed={mode === "table"}
      >
        Table
      </button>
    </div>
  );
}

