import { HTTP_STATUS_CODE } from "@domain/constants/statusCodes";
import { ISignupUseCase } from "@domain/interfaces/useCase/auth/signupUseCase.interface";
import { userRegistrationSchema } from "@infrastructure/validationSchemas/authValidation";
import { HttpResponseMessages } from "@interfaceAdapters/constants/httpResponseMessages";
import { HTTPResponseBuilder } from "@utils/httpResponseBuilder";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

@injectable()
export class AuthController {
  constructor(
    @inject("ISignupUseCase") private _signupUseCase: ISignupUseCase,
  ) {}

  async handleUserRegistration(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = userRegistrationSchema.safeParse(req.body);
      if (data.error) {
        throw new Error(data.error.message);
      }
      await this._signupUseCase.signup(data.data);

      const response = HTTPResponseBuilder.buildSuccessResponse(
        HTTP_STATUS_CODE.OK,
        HttpResponseMessages.OTP_SEND_SUCCESSFULLY,
      );

      res.status(HTTP_STATUS_CODE.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
}
