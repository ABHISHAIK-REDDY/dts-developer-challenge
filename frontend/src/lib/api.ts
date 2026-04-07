import type { Task, TaskCreateInput, TaskUpdateInput } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

type ApiEnvelope<T> = { data: T };
type ApiErrorEnvelope = { error: { code: string; message: string; details?: unknown } };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  const text = await res.text();
  const json = text ? (JSON.parse(text) as unknown) : undefined;

  if (!res.ok) {
    const err = (json ?? {}) as ApiErrorEnvelope;
    const msg = err?.error?.message ?? `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return json as T;
}

export const tasksApi = {
  async list(): Promise<Task[]> {
    const res = await request<ApiEnvelope<Task[]>>("/tasks");
    return res.data;
  },
  async create(input: TaskCreateInput): Promise<Task> {
    const res = await request<ApiEnvelope<Task>>("/tasks", {
      method: "POST",
      body: JSON.stringify(input)
    });
    return res.data;
  },
  async update(id: string, input: TaskUpdateInput): Promise<Task> {
    const res = await request<ApiEnvelope<Task>>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input)
    });
    return res.data;
  },
  async remove(id: string): Promise<{ id: string }> {
    const res = await request<ApiEnvelope<{ id: string }>>(`/tasks/${id}`, { method: "DELETE" });
    return res.data;
  }
};

