import { AppError } from "../errors/AppError";
import { TaskService } from "../services/taskService";
import type { TaskCreateInput, TaskUpdateInput } from "../schemas/taskSchemas";

type FakeTask = {
  id: string;
  title: string;
  description: string | null;
  status: "TO_DO" | "IN_PROGRESS" | "DONE";
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

class FakeRepo {
  private tasks = new Map<string, FakeTask>();

  async create(data: any) {
    const id = "11111111-1111-1111-1111-111111111111";
    const now = new Date("2026-01-01T10:00:00.000Z");
    const task: FakeTask = {
      id,
      title: data.title,
      description: data.description ?? null,
      status: data.status,
      dueDate: data.dueDate,
      createdAt: now,
      updatedAt: now
    };
    this.tasks.set(id, task);
    return task as any;
  }

  async findAll() {
    return [...this.tasks.values()] as any;
  }

  async findById(id: string) {
    return (this.tasks.get(id) ?? null) as any;
  }

  async update(id: string, data: any) {
    const existing = this.tasks.get(id);
    if (!existing) throw new Error("Should not happen in test");

    // Mimic Prisma behaviour: `undefined` fields are ignored on update.
    const patch: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data ?? {})) {
      if (v !== undefined) patch[k] = v;
    }

    const updated: FakeTask = {
      ...existing,
      ...(patch as any),
      updatedAt: new Date("2026-01-02T10:00:00.000Z")
    };
    this.tasks.set(id, updated);
    return updated as any;
  }

  async delete(id: string) {
    const existing = this.tasks.get(id);
    if (!existing) throw new Error("Should not happen in test");
    this.tasks.delete(id);
    return existing as any;
  }
}

describe("TaskService", () => {
  test("create returns DTO with label status and ISO dates", async () => {
    const repo = new FakeRepo();
    const service = new TaskService(repo as any);

    const input: TaskCreateInput = {
      title: "Prepare bundle",
      description: "For hearing",
      status: "In Progress",
      dueDate: new Date("2026-02-01T00:00:00.000Z")
    };

    const dto = await service.create(input);
    expect(dto.title).toBe("Prepare bundle");
    expect(dto.status).toBe("In Progress");
    expect(dto.dueDate).toBe("2026-02-01T00:00:00.000Z");
    expect(dto.createdAt).toMatch(/Z$/);
  });

  test("get throws 404 when task missing", async () => {
    const repo = new FakeRepo();
    const service = new TaskService(repo as any);
    await expect(service.get("22222222-2222-2222-2222-222222222222")).rejects.toEqual(
      expect.objectContaining({ statusCode: 404, code: "TASK_NOT_FOUND" })
    );
  });

  test("update maps status label to prisma enum", async () => {
    const repo = new FakeRepo();
    const service = new TaskService(repo as any);

    const created = await service.create({
      title: "Draft decision",
      description: undefined,
      status: "To Do",
      dueDate: new Date("2026-03-01T00:00:00.000Z")
    });

    const input: TaskUpdateInput = { status: "Done" };
    const updated = await service.update(created.id, input);
    expect(updated.status).toBe("Done");
  });

  test("remove returns id and deletes task", async () => {
    const repo = new FakeRepo();
    const service = new TaskService(repo as any);

    const created = await service.create({
      title: "Call witness",
      description: undefined,
      status: "To Do",
      dueDate: new Date("2026-04-01T00:00:00.000Z")
    });

    const removed = await service.remove(created.id);
    expect(removed).toEqual({ id: created.id });
    await expect(service.get(created.id)).rejects.toMatchObject({
      statusCode: 404,
      code: "TASK_NOT_FOUND"
    });
  });
});

