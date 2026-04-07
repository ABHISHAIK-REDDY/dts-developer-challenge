import express from "express";
import cors from "cors";
import { healthRoutes } from "./routes/healthRoutes";
import { taskRoutes } from "./routes/taskRoutes";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use(healthRoutes);
  app.use(taskRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

