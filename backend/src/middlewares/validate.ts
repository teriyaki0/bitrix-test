import { ZodError, ZodObject, ZodTypeAny } from "zod";
import { Request, Response, NextFunction } from "express";
import { ExtendedRequest } from "../interfaces/express";
import logger from "../libs/logger";

type Schemas = {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
  headers?: ZodTypeAny;
};

function makeStrict<T extends ZodTypeAny>(schema: T): T {
  if (schema instanceof ZodObject) {
    return schema.strict() as any;
  }
  return schema;
}

export function validate(schemas: Schemas) {
  return (req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
      for (const [key, schema] of Object.entries(schemas)) {
        if (!schema) continue;

        const strictSchema = makeStrict(schema);
        const value = (req as any)[key];

        const parsed = strictSchema.parse(value);

        switch (key) {
          case "body":
            req.validatedBody = parsed;
            break;
          case "query":
            req.validatedQuery = parsed;
            break;
          case "params":
            req.validatedParams = parsed;
            break;
          case "headers":
            req.validatedHeaders = parsed;
            break;
        }
      }

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          ok: false,
          error: "VALIDATION_ERROR",
        });
      }

      logger.error({
        ok: false,
        error: "VALIDATION_ERROR",
        details: err.message,
        timestamp: new Date().toISOString(),
      });

      next(err);
    }
  };
}
