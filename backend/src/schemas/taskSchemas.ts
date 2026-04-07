import { z } from "zod";
import { TaskStatusLabels } from "../types/task";

function startOfTodayLocal(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export const taskCreateSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1).optional().or(z.literal("")).transform((v) => {
    if (v === "") return undefined;
    return v;
  }),
  status: z.enum(TaskStatusLabels).optional().default("To Do"),
  dueDate: z
    .string()
    .datetime({ offset: true })
    .or(z.string().datetime({ offset: false }))
    .transform((s) => new Date(s))
    .refine((d) => !Number.isNaN(d.getTime()), "Invalid dueDate")
    .refine((d) => d >= startOfTodayLocal(), "dueDate must not be in the past")
});

export const taskUpdateSchema = taskCreateSchema
  .partial()
  .refine((obj) => Object.keys(obj).length > 0, "At least one field must be provided");

export const taskIdParamSchema = z.object({
  id: z.string().uuid("Invalid task id")
});

export type TaskCreateInput = z.infer<typeof taskCreateSchema>;
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;

