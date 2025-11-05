import { env } from "@config/envConfig";
import { HTTP_STATUS_CODE } from "@domain/enums/statusCodes";
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
  googleLoginSchema,
  loginValidationSchema,
  userRegistrationSchema,
  userRegistrationVerifyOtpSchema,
  userUpdateProfileSchema,
} from "presentation/validationSchemas/authValidation";
import { HttpResponseMessages } from "presentation/constants/httpResponseMessages";
import { HTTPResponseBuilder } from "presentation/utils/httpResponseBuilder";
import { setCookie } from "presentation/utils/setCookie";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IGoogleLoginUseCase } from "@application/interfaces/useCase/auth/googleLoginUseCase.interface";
import { InvalideDataException } from "@application/constants/Exceptions";
import { IGetUserProfileUseCase } from "@application/interfaces/useCase/auth/getUserProfileUseCase.interface";
import { IUpdateUserProfileUseCase } from "@application/interfaces/useCase/auth/updateUserProfileUseCase.interface";
import { MulterFiles } from "@presentation/types/multerFilesType";
import { IUpdateUserProfileRequestDTO } from "@domain/dtos/auth/updateUserProfile.dto";
import { mutlterFileToFileconverter } from "@presentation/utils/Fileconverter";

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
    @inject("IGoogleLoginUseCase")
    private _googleLoginUseCase: IGoogleLoginUseCase,
    @inject("IGetUserProfileUseCase")
    private _getUserProfileUseCase: IGetUserProfileUseCase,
    @inject("IUpdateUserProfileUseCase")
    private _updateUserProfileUseCase: IUpdateUserProfileUseCase,
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

  async handleGoogleLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const loginData = googleLoginSchema.safeParse(req.body);

      if (loginData.error) {
        throw new InvalideDataException(loginData.error.issues[0].message);
      }

      const responseDTO = await this._googleLoginUseCase.execute(
        loginData.data,
      );

      const accessToken = await this._jwtService.createAccessToken({
        id: responseDTO.id,
        role: responseDTO.role,
      });

      const refreshToken = await this._jwtService.createRefreshToken({
        id: responseDTO.id,
        role: responseDTO.role,
      });

      setCookie(res, "refreshToken", refreshToken, {
        maxAge: env.REFRESH_TOKEN_EXPIRATION_TIME * 1000,
        httpOnly: true,
        secure: true,
      });

      const response = HTTPResponseBuilder.buildSuccessResponse(
        HTTP_STATUS_CODE.OK,
        HttpResponseMessages.USER_LOGIN_SUCCESSFULL,
        { userData: responseDTO, accessToken },
      );

      res.status(HTTP_STATUS_CODE.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async handleGetProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = res.locals.user;
      const profile = await this._getUserProfileUseCase.execute(id);
      const response = HTTPResponseBuilder.buildSuccessResponse(
        HTTP_STATUS_CODE.OK,
        HttpResponseMessages.DATA_FETCHED_SUCCESSFULLY,
        profile,
      );

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  async handleUpdateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = res.locals.user;
      const files = req.files as MulterFiles<
        "profile_image" | "verification_id_image"
      >;

      const data: IUpdateUserProfileRequestDTO = { id };

      if (files["profile_image"])
        data.profile_image = mutlterFileToFileconverter(
          files["profile_image"][0],
        );

      if (files["verification_id_image"])
        data.verification_id_image = mutlterFileToFileconverter(
          files["verification_id_image"][0],
        );
      if (req.body.full_name) data.full_name = req.body.full_name;

      const parsedData = userUpdateProfileSchema.safeParse(data);
      if (parsedData.error) {
        throw new InvalideDataException(parsedData.error.issues[0].message);
      }
      await this._updateUserProfileUseCase.update(parsedData.data);
      const response = HTTPResponseBuilder.buildSuccessResponse(
        HTTP_STATUS_CODE.OK,
        HttpResponseMessages.UPDATE_SUCCESSFUL,
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
}
