import { Router } from "express";
import { TaskController } from "../controllers/taskController";

export const taskRoutes = Router();
const controller = new TaskController();

taskRoutes.get("/tasks", controller.list);
taskRoutes.post("/tasks", controller.create);
taskRoutes.get("/tasks/:id", controller.get);
taskRoutes.patch("/tasks/:id", controller.update);
taskRoutes.delete("/tasks/:id", controller.remove);

