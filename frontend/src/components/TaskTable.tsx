import type { Task } from "../lib/types";
import { formatDueDate, shortTaskRef } from "../lib/format";
import { StatusBadge } from "./StatusBadge";

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // ignore
  }
}

export function TaskTable({
  tasks,
  onEdit,
  onDelete
}: {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
          <tr>
            <th scope="col" className="px-4 py-3">
              Title
            </th>
            <th scope="col" className="px-4 py-3">
              Ref
            </th>
            <th scope="col" className="px-4 py-3">
              Status
            </th>
            <th scope="col" className="px-4 py-3">
              Due
            </th>
            <th scope="col" className="px-4 py-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t.id} className="border-t border-slate-200">
              <td className="px-4 py-3">
                <div className="font-medium">{t.title}</div>
                {t.description ? <div className="text-slate-600">{t.description}</div> : null}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700" title={t.id}>
                    {shortTaskRef(t.id)}
                  </span>
                  <button
                    type="button"
                    className="rounded-md px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
                    onClick={() => void copyToClipboard(t.id)}
                    aria-label="Copy full task id"
                    title="Copy full task id"
                  >
                    Copy
                  </button>
                </div>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={t.status} />
              </td>
              <td className="px-4 py-3 text-slate-700">{formatDueDate(t.dueDate)}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-md px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                    onClick={() => onEdit(t)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-md px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                    onClick={() => onDelete(t)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {tasks.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-slate-600" colSpan={5}>
                No tasks yet.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

