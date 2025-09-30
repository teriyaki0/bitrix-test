import express, { NextFunction, Response } from "express";
import { ExtendedRequest } from "../../interfaces/express";
import { HTTP_STATUS_CODE } from "../../constants/http-status-code.enum";
import { healthService } from "../../service/bitrix/health.service";

export const makeHealthRouter = () => {
  const router = express.Router();

  router.get("/bitrix", async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
      const result = await healthService.checkHealth();

      if (result.ok) {
        return res.status(HTTP_STATUS_CODE.OK).json(result);
      }

      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(result);
    } catch (err) {
      next(err);
    }
  });

  return router;
};
