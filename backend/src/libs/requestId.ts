import { v4 as uuidv4 } from "uuid";
import type { Response, NextFunction } from "express";
import { ExtendedRequest } from "../interfaces/express";

export function requestIdMiddleware(req: ExtendedRequest, res: Response, next: NextFunction) {
  req.id = uuidv4();
  res.setHeader("X-Request-Id", req.id);
  next();
}
