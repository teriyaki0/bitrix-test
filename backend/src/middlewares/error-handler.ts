import { NextFunction, Request, Response } from "express";

import { HTTP_STATUS_CODE } from "../constants/http-status-code.enum";
import { ERROR_MESSAGE } from "../constants/messages/error-messages.const";
import logger from "../libs/logger";
import { ExtendedRequest } from "../interfaces/express";

export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly message: string;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }
}

export function errorHandler(err: Error, req: ExtendedRequest, res: Response, next: NextFunction) {
  if (err instanceof HttpError) {
    logger.error({
      msg: err.message,
      statusCode: err.statusCode,
      method: req.method,
      url: req.url,
      stack: err.stack,
    });

    return res.status(err.statusCode).json({ message: err.message });
  }

  logger.error({
    msg: ERROR_MESSAGE.COMMON.INTERNAL_SERVER_ERROR,
    statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
    reqId: req.id,
    method: req.method,
    url: req.url,
    stack: err.stack,
  });

  return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
    error: ERROR_MESSAGE.COMMON.INTERNAL_SERVER_ERROR,
  });
}
