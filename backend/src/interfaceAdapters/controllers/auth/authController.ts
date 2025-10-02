import { HTTP_STATUS_CODE } from "@domain/constants/statusCodes";
import { ISignupResendOtpUsecase } from "@domain/interfaces/useCase/auth/signupResendOtpUseCase.interface";
import { ISignupUseCase } from "@domain/interfaces/useCase/auth/signupUseCase.interface";
import { IVerifyOtpUseCase } from "@domain/interfaces/useCase/auth/verifyOtpUseCase.interface";
import {
  emailValidationSchema,
  userRegistrationSchema,
  userRegistrationVerifyOtpSchema,
} from "@infrastructure/validationSchemas/authValidation";
import { HttpResponseMessages } from "@interfaceAdapters/constants/httpResponseMessages";
import { HTTPResponseBuilder } from "@utils/httpResponseBuilder";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

@injectable()
export class AuthController {
  constructor(
    @inject("ISignupUseCase") private _signupUseCase: ISignupUseCase,
    @inject("IVerifyOtpUseCase") private _verifyOtpUseCase: IVerifyOtpUseCase,
    @inject("ISignupResendOtpUsecase")
    private _resendOtpUseCase: ISignupResendOtpUsecase,
  ) {}

  async handleUserRegistration(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = userRegistrationSchema.safeParse(req.body);
      if (data.error) {
        throw new Error(data.error.issues[0].message);
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

  async handleUserRegistrationVerifyOtp(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = userRegistrationVerifyOtpSchema.safeParse(req.body);

      if (data.error) {
        throw new Error(data.error.issues[0].message);
      }
      await this._verifyOtpUseCase.verify(data.data);

      const response = HTTPResponseBuilder.buildSuccessResponse(
        HTTP_STATUS_CODE.CREATED,
        HttpResponseMessages.USER_SIGNUP_SUCCESS,
      );

      res.status(HTTP_STATUS_CODE.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }

  async handleUserRegistrationResendOtp(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = emailValidationSchema.safeParse(req.body.email);

      if (data.error) {
        throw new Error(data.error.issues[0].message);
      }

      await this._resendOtpUseCase.resend(data.data);

      const response = HTTPResponseBuilder.buildSuccessResponse(
        HTTP_STATUS_CODE.OK,
        HttpResponseMessages.OTP_RESEND_SUCCESSFULLY,
      );

      res.status(HTTP_STATUS_CODE.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
}
