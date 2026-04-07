import React, { useMemo, useState } from "react";
import { z } from "zod";
import { TaskStatusLabels, type Task, type TaskStatus } from "../lib/types";
import { taskFormSchema } from "../lib/schemas";

type Props = {
  initial?: Task | null;
  onSubmit: (values: { title: string; description?: string; status: TaskStatus; dueDate: string }) => Promise<void>;
  onCancel: () => void;
};

function toDateTimeLocalValue(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => `${n}`.padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDateTimeLocalToISO(local: string) {
  // local is interpreted as local time; backend accepts ISO
  const d = new Date(local);
  return d.toISOString();
}

export function TaskForm({ initial, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(initial?.status ?? "To Do");
  const [dueDateLocal, setDueDateLocal] = useState(
    initial?.dueDate ? toDateTimeLocalValue(initial.dueDate) : ""
  );
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const isEdit = useMemo(() => Boolean(initial?.id), [initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const parsed = taskFormSchema.safeParse({
      title,
      description,
      status,
      dueDate: dueDateLocal
    });

    if (!parsed.success) {
      const flat = parsed.error.flatten();
      const errs: Record<string, string> = {};
      for (const [k, v] of Object.entries(flat.fieldErrors)) {
        if (v?.[0]) errs[k] = v[0];
      }
      setFieldErrors(errs);
      setFormError(flat.formErrors?.[0] ?? "Please fix the errors above.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        title: parsed.data.title,
        description: parsed.data.description?.trim() ? parsed.data.description.trim() : undefined,
        status: parsed.data.status,
        dueDate: fromDateTimeLocalToISO(dueDateLocal)
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {formError}
        </div>
      ) : null}

      <div>
        <label className="block text-sm font-medium" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        {fieldErrors.title ? <p className="mt-1 text-sm text-red-700">{fieldErrors.title}</p> : null}
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="description">
          Description <span className="text-slate-500">(optional)</span>
        </label>
        <textarea
          id="description"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          >
            {TaskStatusLabels.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {fieldErrors.status ? <p className="mt-1 text-sm text-red-700">{fieldErrors.status}</p> : null}
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="dueDate">
            Due date
          </label>
          <input
            id="dueDate"
            type="datetime-local"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={dueDateLocal}
            onChange={(e) => setDueDateLocal(e.target.value)}
            required
          />
          {fieldErrors.dueDate ? <p className="mt-1 text-sm text-red-700">{fieldErrors.dueDate}</p> : null}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm hover:bg-slate-50"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? "Saving…" : isEdit ? "Save changes" : "Create task"}
        </button>
      </div>
    </form>
  );
}

