import { Response, Request } from "express";
import { HttpResponse } from "../types/httpResponseType";

export class HTTPResponseBuilder {
  static buildSuccessResponse<T extends object>(
    req: Request,
    res: Response,
    statusCode: number,
    message: string,
    data?: T,
  ): void {
    const response: HttpResponse<T> = {
      success: true,
      data,
      message: req.t(message),
      statusCode,
    };

    res.status(statusCode).json(response);
  }

  static buildErrorResponse(
    req: Request,
    res: Response,
    statusCode: number,
    error: string,
  ): void {
    const response: HttpResponse<object> = {
      success: false,
      error,
      message: req.t(error),
      statusCode,
    };

    res.status(statusCode).json(response);
  }
}
