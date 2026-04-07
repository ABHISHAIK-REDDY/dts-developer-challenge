import type { Task } from "../lib/types";
import { formatDueDate, shortTaskRef } from "../lib/format";
import { StatusBadge } from "./StatusBadge";

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // ignore (clipboard may be blocked)
  }
}

export function TaskCard({
  task,
  onEdit,
  onDelete
}: {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold">{task.title}</h3>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700" title={task.id}>
              Ref {shortTaskRef(task.id)}
            </span>
            <button
              type="button"
              className="rounded-md px-2 py-0.5 text-xs text-slate-700 hover:bg-slate-100"
              onClick={() => void copyToClipboard(task.id)}
              aria-label="Copy full task id"
              title="Copy full task id"
            >
              Copy ID
            </button>
          </div>
          {task.description ? <p className="mt-1 text-sm text-slate-600">{task.description}</p> : null}
        </div>
        <div className="shrink-0">
          <StatusBadge status={task.status} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-slate-600">
          Due <span className="font-medium text-slate-900">{formatDueDate(task.dueDate)}</span>
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-md px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            onClick={onEdit}
          >
            Edit
          </button>
          <button
            type="button"
            className="rounded-md px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </section>
  );
}

