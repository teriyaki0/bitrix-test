import express from "express";

import { makeHealthRouter } from "../routes/health";
import { makeCatalogRouter } from "../routes/catalog";
import { makeDealRouter } from "../routes/deals";

export const loadRoutes = (app: express.Router) => {
  app.use("/api/health", makeHealthRouter());
  app.use("/api/catalog", makeCatalogRouter());
  app.use("/api/deals", makeDealRouter());
  //   app.use("/api/experiences", makeExperienceRouter());
  //   app.use("/api/feedbacks", makeFeedbackRouter());
  //   app.use("/api/projects", makeProjectRouter());
};
