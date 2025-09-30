import express from "express";
import cors from "cors";

import { Loader } from "../interfaces/general";
import httpLogger from "../middlewares/http-logger";
import { requestIdMiddleware } from "../libs/requestId";

export const loadMiddlewares: Loader = (app) => {
  app.use(cors());
  app.use(express.json());
  app.use(httpLogger);
  app.use(requestIdMiddleware);
};
