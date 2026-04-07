import { TaskStatus } from "@prisma/client";

export const TaskStatusLabels = ["To Do", "In Progress", "Done"] as const;
export type TaskStatusLabel = (typeof TaskStatusLabels)[number];

export function toPrismaStatus(label: TaskStatusLabel): TaskStatus {
  switch (label) {
    case "To Do":
      return TaskStatus.TO_DO;
    case "In Progress":
      return TaskStatus.IN_PROGRESS;
    case "Done":
      return TaskStatus.DONE;
  }
}

export function fromPrismaStatus(status: TaskStatus): TaskStatusLabel {
  switch (status) {
    case TaskStatus.TO_DO:
      return "To Do";
    case TaskStatus.IN_PROGRESS:
      return "In Progress";
    case TaskStatus.DONE:
      return "Done";
  }
}

