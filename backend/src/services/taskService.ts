import type { Task } from "@prisma/client";
import { AppError } from "../errors/AppError";
import type { TaskCreateInput, TaskUpdateInput } from "../schemas/taskSchemas";
import { fromPrismaStatus, toPrismaStatus } from "../types/task";
import { TaskRepository } from "../repositories/taskRepository";

export type TaskDto = {
  id: string;
  title: string;
  description?: string | null;
  status: "To Do" | "In Progress" | "Done";
  dueDate: string;
  createdAt: string;
  updatedAt: string;
};

function toDto(task: Task): TaskDto {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: fromPrismaStatus(task.status),
    dueDate: task.dueDate.toISOString(),
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString()
  };
}

export class TaskService {
  constructor(private readonly repo = new TaskRepository()) {}

  async create(input: TaskCreateInput): Promise<TaskDto> {
    const created = await this.repo.create({
      title: input.title,
      description: input.description,
      status: toPrismaStatus(input.status),
      dueDate: input.dueDate
    });
    return toDto(created);
  }

  async list(): Promise<TaskDto[]> {
    const tasks = await this.repo.findAll();
    return tasks.map(toDto);
  }

  async get(id: string): Promise<TaskDto> {
    const task = await this.repo.findById(id);
    if (!task) throw new AppError("Task not found", 404, "TASK_NOT_FOUND");
    return toDto(task);
  }

  async update(id: string, input: TaskUpdateInput): Promise<TaskDto> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new AppError("Task not found", 404, "TASK_NOT_FOUND");

    const updated = await this.repo.update(id, {
      title: input.title,
      description: input.description,
      status: input.status ? toPrismaStatus(input.status) : undefined,
      dueDate: input.dueDate
    });
    return toDto(updated);
  }

  async remove(id: string): Promise<{ id: string }> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new AppError("Task not found", 404, "TASK_NOT_FOUND");
    await this.repo.delete(id);
    return { id };
  }
}

