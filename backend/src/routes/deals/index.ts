import express, { NextFunction, Request, Response } from "express";
import { ExtendedRequest } from "../../interfaces/express";
import { validate } from "../../middlewares/validate";
import { dealService } from "../../service/bitrix/deal.service";
import { createDealSchema } from "./scheme/create-deal.scheme";

export const makeDealRouter = () => {
  const router = express.Router();

  router.post("/", validate({ body: createDealSchema }), async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
      const data = req.validatedBody;
      const result = await dealService.createDeal(data);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  return router;
};
