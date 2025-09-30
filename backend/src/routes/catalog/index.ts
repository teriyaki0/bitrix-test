import express, { NextFunction, Response } from "express";
import { searchQuerySchema, SearchQueryDto } from "./scheme/search.scheme";
import { validate } from "../../middlewares/validate";
import { ExtendedRequest } from "../../interfaces/express";
import { productService } from "../../service/bitrix/product.service";

export const makeCatalogRouter = () => {
  const router = express.Router();

  router.get("/services/search", validate({ query: searchQuerySchema }), async (req: ExtendedRequest<undefined, SearchQueryDto>, res: Response, next: NextFunction) => {
    try {
      const { q } = req.validatedQuery;
      const results = await productService.searchServices(q);
      res.json(results);
    } catch (error) {
      next(error);
    }
  });

  router.get("/devices/search", validate({ query: searchQuerySchema }), async (req: ExtendedRequest<undefined, SearchQueryDto>, res: Response, next: NextFunction) => {
    try {
      const { q } = req.validatedQuery;
      const results = await productService.searchDevices(q);
      res.json(results);
    } catch (error) {
      next(error);
    }
  });

  router.get("/parts/search", validate({ query: searchQuerySchema }), async (req: ExtendedRequest<undefined, SearchQueryDto>, res: Response, next: NextFunction) => {
    try {
      const { q } = req.validatedQuery;
      const results = await productService.searchParts(q);
      res.json(results);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
