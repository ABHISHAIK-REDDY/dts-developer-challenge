import type { Task } from "../lib/types";
import { Modal } from "./Modal";
import { TaskForm } from "./TaskForm";

export function TaskFormModal({
  open,
  task,
  onClose,
  onSubmit
}: {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSubmit: (values: { title: string; description?: string; status: Task["status"]; dueDate: string }) => Promise<void>;
}) {
  const title = task ? "Edit task" : "Create task";
  return (
    <Modal title={title} open={open} onClose={onClose}>
      <TaskForm
        initial={task}
        onCancel={onClose}
        onSubmit={async (values) => {
          await onSubmit(values);
          onClose();
        }}
      />
    </Modal>
  );
}

