import React, { useMemo, useState } from "react";
import { TasksProvider, useTasks } from "./context/TasksContext";
import type { Task, TaskStatus } from "./lib/types";
import { TaskViewToggle, type TaskViewMode } from "./components/TaskViewToggle";
import { TaskCards } from "./components/TaskCards";
import { TaskTable } from "./components/TaskTable";
import { TaskFormModal } from "./components/TaskFormModal";
import { TaskStatusLabels } from "./lib/types";

type SortMode = "dueSoon" | "createdNewest" | "updatedNewest";

function Dashboard() {
  const { tasks, loading, error, refresh, createTask, updateTask, deleteTask } = useTasks();
  const [mode, setMode] = useState<TaskViewMode>("cards");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "All">("All");
  const [sortMode, setSortMode] = useState<SortMode>("dueSoon");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      if (statusFilter !== "All" && t.status !== statusFilter) return false;
      if (!q) return true;
      return (
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        (t.description ?? "").toLowerCase().includes(q)
      );
    });
  }, [tasks, query, statusFilter]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      switch (sortMode) {
        case "dueSoon":
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case "createdNewest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "updatedNewest":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });
    return copy;
  }, [filtered, sortMode]);

  const counts = useMemo(() => {
    const all = tasks.length;
    const byStatus = new Map<TaskStatus, number>([
      ["To Do", 0],
      ["In Progress", 0],
      ["Done", 0]
    ]);
    for (const t of tasks) byStatus.set(t.status, (byStatus.get(t.status) ?? 0) + 1);
    return { all, byStatus };
  }, [tasks]);

  return (
    <div className="hmcts-surface min-h-dvh">
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50">
        Skip to content
      </a>
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="h-1 w-full bg-gradient-to-r from-blue-800 via-sky-600 to-emerald-600" />
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">HMCTS</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                <span className="hmcts-gradient-text">Caseworker Task Manager</span>
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-700">
                Track, prioritise, and complete tasks efficiently. Use search to find tasks by title, description, or
                task reference.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <TaskViewToggle mode={mode} onChange={setMode} />
              <button
                type="button"
                className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
                onClick={() => {
                  setEditing(null);
                  setModalOpen(true);
                }}
              >
                Create task
              </button>
            </div>
          </div>

          <section className="mt-5 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-5">
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-slate-800" htmlFor="search">
                Search
              </label>
              <input
                id="search"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, description, or paste an ID…"
              />
              <p className="mt-1 text-xs text-slate-600">
                Tip: IDs are long. Use the short <span className="font-medium">Ref</span> shown on each task, or paste
                the full UUID.
              </p>
            </div>
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-slate-800" htmlFor="statusFilter">
                Status
              </label>
              <select
                id="statusFilter"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TaskStatus | "All")}
              >
                <option value="All">All</option>
                {TaskStatusLabels.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-slate-800" htmlFor="sortMode">
                Sort by
              </label>
              <select
                id="sortMode"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
              >
                <option value="dueSoon">Due date (soonest)</option>
                <option value="createdNewest">Created (newest)</option>
                <option value="updatedNewest">Updated (newest)</option>
              </select>
            </div>
          </section>
        </div>
      </header>

      <main id="content" className="mx-auto max-w-6xl px-4 py-8">
        <section aria-label="Task list">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-700">
              {loading ? "Loading tasks…" : `${sorted.length} result${sorted.length === 1 ? "" : "s"} (from ${counts.all} total)`}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800 ring-1 ring-inset ring-blue-200">
                To Do {counts.byStatus.get("To Do") ?? 0}
              </span>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-200">
                In Progress {counts.byStatus.get("In Progress") ?? 0}
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 ring-1 ring-inset ring-emerald-200">
                Done {counts.byStatus.get("Done") ?? 0}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {query || statusFilter !== "All" || sortMode !== "dueSoon" ? (
                <button
                  type="button"
                  className="rounded-md px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                  onClick={() => {
                    setQuery("");
                    setStatusFilter("All");
                    setSortMode("dueSoon");
                  }}
                >
                  Clear filters
                </button>
              ) : null}
              <button
                type="button"
                className="rounded-md px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                onClick={() => void refresh()}
              >
                Refresh
              </button>
            </div>
          </div>

          {error ? (
            <div
              className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
              role="alert"
            >
              {error}
            </div>
          ) : null}

          <div className="mt-4">
            {loading ? (
              <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-700">Loading…</div>
            ) : sorted.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="text-base font-semibold text-slate-900">No matching tasks</h2>
                <p className="mt-1 text-sm text-slate-700">
                  Try clearing filters, or create a new task for your casework.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
                    onClick={() => {
                      setEditing(null);
                      setModalOpen(true);
                    }}
                  >
                    Create task
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm hover:bg-slate-50"
                    onClick={() => {
                      setQuery("");
                      setStatusFilter("All");
                      setSortMode("dueSoon");
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            ) : mode === "cards" ? (
              <TaskCards
                tasks={sorted}
                onEdit={(t) => {
                  setEditing(t);
                  setModalOpen(true);
                }}
                onDelete={(t) => {
                  const ok = window.confirm(`Delete "${t.title}"?`);
                  if (!ok) return;
                  setBusyId(t.id);
                  void deleteTask(t.id).finally(() => setBusyId(null));
                }}
              />
            ) : (
              <TaskTable
                tasks={sorted}
                onEdit={(t) => {
                  setEditing(t);
                  setModalOpen(true);
                }}
                onDelete={(t) => {
                  const ok = window.confirm(`Delete "${t.title}"?`);
                  if (!ok) return;
                  setBusyId(t.id);
                  void deleteTask(t.id).finally(() => setBusyId(null));
                }}
              />
            )}
          </div>

          {busyId ? <p className="mt-3 text-sm text-slate-600">Working…</p> : null}
        </section>

        <TaskFormModal
          open={modalOpen}
          task={editing}
          onClose={() => setModalOpen(false)}
          onSubmit={async (values) => {
            if (editing) {
              await updateTask(editing.id, values);
            } else {
              await createTask(values);
            }
          }}
        />
      </main>
    </div>
  );
}

export function App() {
  return (
    <TasksProvider>
      <Dashboard />
    </TasksProvider>
  );
}

