import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Task, TaskCreateInput, TaskUpdateInput } from "../lib/types";
import { tasksApi } from "../lib/api";

type TasksState = {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createTask: (input: TaskCreateInput) => Promise<Task>;
  updateTask: (id: string, input: TaskUpdateInput) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
};

const TasksContext = createContext<TasksState | null>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await tasksApi.list();
      setTasks(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createTask = useCallback(async (input: TaskCreateInput) => {
    const created = await tasksApi.create(input);
    setTasks((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateTask = useCallback(async (id: string, input: TaskUpdateInput) => {
    const updated = await tasksApi.update(id, input);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    await tasksApi.remove(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(
    () => ({ tasks, loading, error, refresh, createTask, updateTask, deleteTask }),
    [tasks, loading, error, refresh, createTask, updateTask, deleteTask]
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used within TasksProvider");
  return ctx;
}

