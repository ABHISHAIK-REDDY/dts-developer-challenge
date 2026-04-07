import type { TaskStatus } from "./types";

export function formatDueDate(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit"
  }).format(d);
}

export function shortTaskRef(id: string) {
  return id.slice(0, 8).toUpperCase();
}

export function statusClasses(status: TaskStatus) {
  switch (status) {
    case "To Do":
      return "bg-blue-50 text-blue-800 ring-blue-200";
    case "In Progress":
      return "bg-amber-50 text-amber-800 ring-amber-200";
    case "Done":
      return "bg-emerald-50 text-emerald-800 ring-emerald-200";
  }
}

