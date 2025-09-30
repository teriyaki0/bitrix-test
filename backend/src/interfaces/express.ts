import { Request } from "express";

export type ExtendedRequest<Body = any, Query = any, Params = any, Headers = any> = Request<Params, any, Body, Query, Headers> & {
  id: string;
  validatedBody?: Body;
  validatedQuery?: Query;
  validatedParams?: Params;
  validatedHeaders?: Headers;
};
