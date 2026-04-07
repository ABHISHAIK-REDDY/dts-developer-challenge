export const TaskStatusLabels = ["To Do", "In Progress", "Done"] as const;
export type TaskStatus = (typeof TaskStatusLabels)[number];

export type Task = {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  dueDate: string; // ISO
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

export type TaskCreateInput = {
  title: string;
  description?: string;
  status?: TaskStatus;
  dueDate: string; // ISO
};

export type TaskUpdateInput = Partial<TaskCreateInput>;

