import { HttpResponse } from "../types/httpResponseType";

export class HTTPResponseBuilder {
  static buildSuccessResponse<T extends object>(
    statusCode: number,
    message?: string,
    data?: T,
  ): HttpResponse<T> {
    return {
      success: true,
      data,
      message,
      statusCode,
    };
  }

  static buildErrorResponse(
    statusCode: number,
    error?: string,
    message?: string,
  ): HttpResponse<{}> {
    return {
      success: false,
      error,
      message,
      statusCode,
    };
  }
}
