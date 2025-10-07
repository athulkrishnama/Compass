import { IGetUsersUseCase } from "@domain/interfaces/useCase/admin/getUsersUseCase.interface";
import { IUserStatusChangeUseCase } from "@domain/interfaces/useCase/admin/userStatusChangeUseCase.interface";
import { IForgetPasswordResetPasswordUseCase } from "@domain/interfaces/useCase/auth/forgetPasswordResetPassword.interface";
import { IForgetPasswordSendOtpUseCase } from "@domain/interfaces/useCase/auth/forgetPasswordSendOtpUseCase.interface";
import { IForgetPasswordVerifyOtpUseCase } from "@domain/interfaces/useCase/auth/forgetPasswordVerifyOtpUseCase.interface";
import { ILoginUseCase } from "@domain/interfaces/useCase/auth/loginUseCase.interface";
import { IRefreshTokenUseCase } from "@domain/interfaces/useCase/auth/refreshTokenUseCase.interface";
import { ISignupResendOtpUsecase } from "@domain/interfaces/useCase/auth/signupResendOtpUseCase.interface";
import { ISignupUseCase } from "@domain/interfaces/useCase/auth/signupUseCase.interface";
import { IVerifyOtpUseCase } from "@domain/interfaces/useCase/auth/verifyOtpUseCase.interface";
import { GetUsersUseCase } from "@useCases/admin/getUsersUseCase";
import { UserStatusChangeUseCase } from "@useCases/admin/userStatusChangeUseCase";
import { ForgetPasswordResetPasswordUseCase } from "@useCases/auth/forgetPasswordResetPasswordUseCase";
import { ForgetPasswordSendOtpUseCase } from "@useCases/auth/forgetPasswordSendOtpUseCase";
import { ForgetPasswordVerifyOtpUseCase } from "@useCases/auth/forgetPasswordVerifyOtpUseCase";
import { LoginUseCase } from "@useCases/auth/loginUseCase";
import { RefreshTokenUseCase } from "@useCases/auth/refreshTokenUseCase";
import { SignupResendOtpUseCase } from "@useCases/auth/signupResendOtpUseCase";
import { SignupUseCase } from "@useCases/auth/signupUseCase";
import { SignupVerifyOtpUseCase } from "@useCases/auth/signupVerifyOtpUseCase";
import { container } from "tsyringe";

export function registerUsecases() {
  container.registerSingleton<ISignupUseCase>("ISignupUseCase", SignupUseCase);
  container.registerSingleton<IVerifyOtpUseCase>(
    "IVerifyOtpUseCase",
    SignupVerifyOtpUseCase,
  );
  container.registerSingleton<ISignupResendOtpUsecase>(
    "ISignupResendOtpUsecase",
    SignupResendOtpUseCase,
  );
  container.registerSingleton<ILoginUseCase>("ILoginUseCase", LoginUseCase);
  container.registerSingleton<IForgetPasswordSendOtpUseCase>(
    "IForgetPasswordSendOtpUseCase",
    ForgetPasswordSendOtpUseCase,
  );
  container.registerSingleton<IForgetPasswordVerifyOtpUseCase>(
    "IForgetPasswordVerifyOtpUseCase",
    ForgetPasswordVerifyOtpUseCase,
  );
  container.registerSingleton<IForgetPasswordResetPasswordUseCase>(
    "IForgetPasswordResetPasswordUseCase",
    ForgetPasswordResetPasswordUseCase,
  );
  container.registerSingleton<IRefreshTokenUseCase>(
    "IRefreshTokenUseCase",
    RefreshTokenUseCase,
  );
  container.registerSingleton<IGetUsersUseCase>(
    "IGetUsersUseCase",
    GetUsersUseCase,
  );
  container.registerSingleton<IUserStatusChangeUseCase>(
    "IUserStatusChangeUseCase",
    UserStatusChangeUseCase,
  );
}
