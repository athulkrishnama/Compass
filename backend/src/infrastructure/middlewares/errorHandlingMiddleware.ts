import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../constants/statusCodes";
import { Errors } from "../constants/Error";

export const errorHandlingMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  void next;
  try {
    res
      .status(StatusCode.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: Errors.INTERNAL_SERVER_ERROR });

    console.log(err instanceof Error ? err.message : err);
  } catch (error) {
    console.log(error);
  }
};
