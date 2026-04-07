import type { Task } from "../lib/types";
import { TaskCard } from "./TaskCard";

export function TaskCards({
  tasks,
  onEdit,
  onDelete
}: {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {tasks.map((t) => (
        <TaskCard key={t.id} task={t} onEdit={() => onEdit(t)} onDelete={() => onDelete(t)} />
      ))}
    </div>
  );
}

