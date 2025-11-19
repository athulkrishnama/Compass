import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS_CODE } from "@domain/enums/statusCodes";
import { Errors } from "../constants/Error";
import { HTTPResponseBuilder } from "presentation/utils/httpResponseBuilder";
import {
  ApplicationException,
  InvalideDataException,
  InvalidOTPException,
  OTPExpiredException,
  PasswordNotMatchingException,
  TokenExpiredException,
  TokenMissingException,
  UserAlreadyExistingException,
  UserDataMissingException,
  UserIsBlockedException,
  UserNotFoundException,
} from "@application/constants/Exceptions";

export const errorHandlingMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  void next;
  try {
    let statusCode = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;

    if (err instanceof ApplicationException) {
      if (err instanceof UserNotFoundException) {
        statusCode = HTTP_STATUS_CODE.NOT_FOUND;
      } else if (err instanceof UserAlreadyExistingException) {
        statusCode = HTTP_STATUS_CODE.CONFLICT;
      } else if (err instanceof UserIsBlockedException) {
        statusCode = HTTP_STATUS_CODE.FORBIDDEN;
      } else if (
        err instanceof InvalidOTPException ||
        err instanceof OTPExpiredException ||
        err instanceof UserDataMissingException ||
        err instanceof PasswordNotMatchingException ||
        err instanceof TokenMissingException ||
        err instanceof InvalideDataException
      ) {
        statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
      } else if (err instanceof TokenExpiredException) {
        statusCode = HTTP_STATUS_CODE.UNAUTHORIZED;
      }
    }

    HTTPResponseBuilder.buildErrorResponse(
      req,
      res,
      statusCode,
      err instanceof Error ? err.message : Errors.INTERNAL_SERVER_ERROR,
    );

    console.log(err instanceof Error ? err.message : err);
  } catch (error) {
    console.log(error);
  }
};
