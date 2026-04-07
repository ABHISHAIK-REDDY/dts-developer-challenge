import type { RequestHandler } from "express";
import { TaskService } from "../services/taskService";
import { taskCreateSchema, taskIdParamSchema, taskUpdateSchema } from "../schemas/taskSchemas";

export class TaskController {
  constructor(private readonly service = new TaskService()) {}

  create: RequestHandler = async (req, res, next) => {
    try {
      const input = taskCreateSchema.parse(req.body);
      const task = await this.service.create(input);
      res.status(201).json({ data: task });
    } catch (err) {
      next(err);
    }
  };

  list: RequestHandler = async (_req, res, next) => {
    try {
      const tasks = await this.service.list();
      res.json({ data: tasks });
    } catch (err) {
      next(err);
    }
  };

  get: RequestHandler = async (req, res, next) => {
    try {
      const { id } = taskIdParamSchema.parse(req.params);
      const task = await this.service.get(id);
      res.json({ data: task });
    } catch (err) {
      next(err);
    }
  };

  update: RequestHandler = async (req, res, next) => {
    try {
      const { id } = taskIdParamSchema.parse(req.params);
      const input = taskUpdateSchema.parse(req.body);
      const task = await this.service.update(id, input);
      res.json({ data: task });
    } catch (err) {
      next(err);
    }
  };

  remove: RequestHandler = async (req, res, next) => {
    try {
      const { id } = taskIdParamSchema.parse(req.params);
      const result = await this.service.remove(id);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  };
}

