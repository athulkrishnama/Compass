import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../constants/statusCodes";
import { Errors } from "../constants/Error";
import { HTTPResponseBuilder } from "@utils/httpResponseBuilder";

export const errorHandlingMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  void next;
  try {
    const errorResponse = HTTPResponseBuilder.buildErrorResponse(
      StatusCode.INTERNAL_SERVER_ERROR,
      err instanceof Error ? err.message : Errors.INTERNAL_SERVER_ERROR,
    );
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json(errorResponse);

    console.log(err instanceof Error ? err.message : err);
  } catch (error) {
    console.log(error);
  }
};
