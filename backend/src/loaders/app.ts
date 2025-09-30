import express from "express";

import { errorHandler } from "../middlewares/error-handler";
import { loadMiddlewares } from "./middlewares";
import { loadRoutes } from "./routes";

export const loadApp = async () => {
  const app = express();

  loadMiddlewares(app);

  loadRoutes(app);

  app.use(errorHandler);

  return app;
};
