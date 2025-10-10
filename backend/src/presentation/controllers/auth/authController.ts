import { env } from "@config/envConfig";
import { HTTP_STATUS_CODE } from "@domain/constants/statusCodes";
import { IJwtService } from "application/interfaces/service/jwtService.interface";
import { IForgetPasswordResetPasswordUseCase } from "application/interfaces/useCase/auth/forgetPasswordResetPassword.interface";
import { IForgetPasswordSendOtpUseCase } from "application/interfaces/useCase/auth/forgetPasswordSendOtpUseCase.interface";
import { IForgetPasswordVerifyOtpUseCase } from "application/interfaces/useCase/auth/forgetPasswordVerifyOtpUseCase.interface";
import { ILoginUseCase } from "application/interfaces/useCase/auth/loginUseCase.interface";
import { IRefreshTokenUseCase } from "application/interfaces/useCase/auth/refreshTokenUseCase.interface";
import { ISignupResendOtpUsecase } from "application/interfaces/useCase/auth/signupResendOtpUseCase.interface";
import { ISignupUseCase } from "application/interfaces/useCase/auth/signupUseCase.interface";
import { ITokenInvalidationUseCase } from "application/interfaces/useCase/auth/tokenInvalidationUseCase.interface";
import { IVerifyOtpUseCase } from "application/interfaces/useCase/auth/verifyOtpUseCase.interface";
import {
  emailValidationSchema,
  forgetPasswordResetPasswordSchema,
  forgetPasswordVerifyOtpSchema,
  loginValidationSchema,
  userRegistrationSchema,
  userRegistrationVerifyOtpSchema,
} from "presentation/validationSchemas/authValidation";
import { HttpResponseMessages } from "presentation/constants/httpResponseMessages";
import { HTTPResponseBuilder } from "presentation/utils/httpResponseBuilder";
import { setCookie } from "presentation/utils/setCookie";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

@injectable()
export class AuthController {
  constructor(
    @inject("ISignupUseCase") private _signupUseCase: ISignupUseCase,
    @inject("IVerifyOtpUseCase") private _verifyOtpUseCase: IVerifyOtpUseCase,
    @inject("ISignupResendOtpUsecase")
    private _resendOtpUseCase: ISignupResendOtpUsecase,
    @inject("ILoginUseCase") private _loginUseCase: ILoginUseCase,
    @inject("IJwtService") private _jwtService: IJwtService,
    @inject("IForgetPasswordSendOtpUseCase")
    private _forgetPasswordSendOtpUseCase: IForgetPasswordSendOtpUseCase,
    @inject("IForgetPasswordVerifyOtpUseCase")
    private _forgetPasswordVerifyOtpUseCase: IForgetPasswordVerifyOtpUseCase,
    @inject("IForgetPasswordResetPasswordUseCase")
    private _forgetPassawordResetPasswordUseCase: IForgetPasswordResetPasswordUseCase,
    @inject("IRefreshTokenUseCase")
    private _tokenRefreshUseCase: IRefreshTokenUseCase,
    @inject("ITokenInvalidationUseCase")
    private _tokenInvalidationUseCase: ITokenInvalidationUseCase,
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

  async handleUserLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const data = loginValidationSchema.safeParse(req.body);

      if (data.error) {
        throw new Error(data.error.issues[0].message);
      }

      const responseDto = await this._loginUseCase.login(data.data);

      const accessToken = await this._jwtService.createAccessToken({
        id: responseDto.id,
        role: responseDto.role,
      });

      const refreshToken = await this._jwtService.createRefreshToken({
        id: responseDto.id,
        role: responseDto.role,
      });

      setCookie(res, "refreshToken", refreshToken, {
        maxAge: env.REFRESH_TOKEN_EXPIRATION_TIME * 1000,
        httpOnly: true,
        secure: true,
      });

      const response = HTTPResponseBuilder.buildSuccessResponse(
        HTTP_STATUS_CODE.OK,
        HttpResponseMessages.USER_LOGIN_SUCCESSFULL,
        { userData: responseDto, accessToken },
      );

      res.status(HTTP_STATUS_CODE.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async handleForgetPasswordSendOtp(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = emailValidationSchema.safeParse(req.body.email);

      if (data.error) {
        throw new Error(data.error.issues[0].message);
      }

      await this._forgetPasswordSendOtpUseCase.sendOtp(data.data);

      const response = HTTPResponseBuilder.buildSuccessResponse(
        HTTP_STATUS_CODE.OK,
        HttpResponseMessages.OTP_SEND_SUCCESSFULLY,
      );
      res.status(HTTP_STATUS_CODE.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async handleForgetPasswordVerifyOtp(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = forgetPasswordVerifyOtpSchema.safeParse(req.body);

      if (data.error) {
        throw new Error(data.error.issues[0].message);
      }

      const token = await this._forgetPasswordVerifyOtpUseCase.verify(
        data.data,
      );

      const response = HTTPResponseBuilder.buildSuccessResponse(
        HTTP_STATUS_CODE.OK,
        HttpResponseMessages.OTP_VERIFIED_SUCCESSFULLY,
        { token },
      );

      res.status(HTTP_STATUS_CODE.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async handleForgetpasswordPasswordReset(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = forgetPasswordResetPasswordSchema.safeParse(req.body);

      if (data.error) {
        throw new Error(data.error.issues[0].message);
      }

      await this._forgetPassawordResetPasswordUseCase.reset(data.data);

      const response = HTTPResponseBuilder.buildSuccessResponse(
        HTTP_STATUS_CODE.OK,
        HttpResponseMessages.PASSWORD_RESET_SUCCESSFUL,
      );

      res.status(HTTP_STATUS_CODE.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async handleTokenRefresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken;
      const accessToken = await this._tokenRefreshUseCase.refresh(refreshToken);

      const response = HTTPResponseBuilder.buildSuccessResponse(
        HTTP_STATUS_CODE.OK,
        HttpResponseMessages.REFRESH_SUCCESSFUL,
        { accessToken },
      );
      res.status(HTTP_STATUS_CODE.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async handleLogout(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = req.header("Authorization")!;
      if (accessToken && accessToken.split(" ")[1])
        await this._tokenInvalidationUseCase.validate(
          accessToken.split(" ")[1],
        );

      const response = HTTPResponseBuilder.buildSuccessResponse(
        HTTP_STATUS_CODE.OK,
        HttpResponseMessages.LOGOUT_SUCCESSFUL,
      );

      res.status(HTTP_STATUS_CODE.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
}
