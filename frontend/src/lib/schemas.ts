import { z } from "zod";
import { TaskStatusLabels } from "./types";

function startOfTodayLocal(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export const taskFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().optional(),
  status: z.enum(TaskStatusLabels).default("To Do"),
  dueDate: z
    .string()
    .min(1, "Due date is required")
    .transform((s) => new Date(s))
    .refine((d) => !Number.isNaN(d.getTime()), "Invalid due date")
    .refine((d) => d >= startOfTodayLocal(), "Due date must not be in the past")
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

