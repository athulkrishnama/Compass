import { IGetUsersUseCase } from "application/interfaces/useCase/admin/getUsersUseCase.interface";
import { IUserStatusChangeUseCase } from "application/interfaces/useCase/admin/userStatusChangeUseCase.interface";
import { IForgetPasswordResetPasswordUseCase } from "application/interfaces/useCase/auth/forgetPasswordResetPassword.interface";
import { IForgetPasswordSendOtpUseCase } from "application/interfaces/useCase/auth/forgetPasswordSendOtpUseCase.interface";
import { IForgetPasswordVerifyOtpUseCase } from "application/interfaces/useCase/auth/forgetPasswordVerifyOtpUseCase.interface";
import { ILoginUseCase } from "application/interfaces/useCase/auth/loginUseCase.interface";
import { IRefreshTokenUseCase } from "application/interfaces/useCase/auth/refreshTokenUseCase.interface";
import { ISignupResendOtpUsecase } from "application/interfaces/useCase/auth/signupResendOtpUseCase.interface";
import { ISignupUseCase } from "application/interfaces/useCase/auth/signupUseCase.interface";
import { ITokenInvalidationUseCase } from "application/interfaces/useCase/auth/tokenInvalidationUseCase.interface";
import { IVerifyOtpUseCase } from "application/interfaces/useCase/auth/verifyOtpUseCase.interface";
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
import { TokenInvalidationUseCase } from "@useCases/auth/tokenInvalidationUseCase";
import { container } from "tsyringe";
import { IGoogleLoginUseCase } from "@application/interfaces/useCase/auth/googleLoginUseCase.interface";
import { GoogleLoginUseCase } from "@useCases/auth/googleLoginUseCase";
import { IGetUserProfileUseCase } from "@application/interfaces/useCase/auth/getUserProfileUseCase.interface";
import { GetUserProfileUseCase } from "@useCases/auth/getUserProfileUseCase";
import { IUpdateUserProfileUseCase } from "@application/interfaces/useCase/auth/updateUserProfileUseCase.interface";
import { UpdateUserProfileUseCase } from "@useCases/auth/updateUserProfileUseCase";
import { IGetUnverifiedUsersUseCase } from "@application/interfaces/useCase/admin/getUnverifiedUserUseCase.interface";
import { GetUnverifiedUsersUseCase } from "@useCases/admin/getUnverifiedUsersUseCase";
import { GetUnverifiedUserDetailsUseCase } from "@useCases/admin/getUnverifiedUserDetailsUseCase";
import { IGetUnverifiedUserDetailsUseCase } from "@application/interfaces/useCase/admin/getUnverifiedUserDetailsUseCase.interface";
import { IApproveUserVerificationRequestUseCase } from "@application/interfaces/useCase/admin/approveUserVerificationRequestUseCase.interface";
import { ApproveUserVerificationRequestUseCase } from "@useCases/admin/approveUserVerificationRequestUseCase";
import { IRejectUserVerificationRequestUseCase } from "@application/interfaces/useCase/admin/rejectUserVerificationRequestUseCase.interface";
import { RejectUserVerificationRequestUseCase } from "@useCases/admin/rejectUserVerificationRequestUseCase";
import { IChangePasswordUseCase } from "@application/interfaces/useCase/auth/changePasswordUseCase.interface";
import { ChangePasswordUseCase } from "@useCases/auth/changePasswordUseCase";
import { IUpdateVehicleUseCase } from "@application/interfaces/useCase/cab/updateVehicleUseCase.interface";
import { UpdateVehicleUseCase } from "@useCases/cab/updateVehicleUseCase";
import { IGetCabDetailsUseCase } from "@application/interfaces/useCase/cab/getCabDetailsUseCase.interface";
import { GetCabDetailsUseCase } from "@useCases/cab/getCabDetailsUseCase";
import { IDeleteCabImageUseCase } from "@application/interfaces/useCase/cab/deleteCabImageUseCase.interface";
import { DeleteCabImageUseCase } from "@useCases/cab/deleteCabImageUseCase";

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
  container.registerSingleton<ITokenInvalidationUseCase>(
    "ITokenInvalidationUseCase",
    TokenInvalidationUseCase,
  );
  container.registerSingleton<IGoogleLoginUseCase>(
    "IGoogleLoginUseCase",
    GoogleLoginUseCase,
  );
  container.registerSingleton<IGetUserProfileUseCase>(
    "IGetUserProfileUseCase",
    GetUserProfileUseCase,
  );
  container.registerSingleton<IUpdateUserProfileUseCase>(
    "IUpdateUserProfileUseCase",
    UpdateUserProfileUseCase,
  );
  container.registerSingleton<IGetUnverifiedUsersUseCase>(
    "IGetUnverifiedUsersUseCase",
    GetUnverifiedUsersUseCase,
  );
  container.registerSingleton<IGetUnverifiedUserDetailsUseCase>(
    "IGetUnverifiedUserDetailsUseCase",
    GetUnverifiedUserDetailsUseCase,
  );
  container.registerSingleton<IApproveUserVerificationRequestUseCase>(
    "IApproveUserVerificationRequestUseCase",
    ApproveUserVerificationRequestUseCase,
  );
  container.registerSingleton<IRejectUserVerificationRequestUseCase>(
    "IRejectUserVerificationRequestUseCase",
    RejectUserVerificationRequestUseCase,
  );
  container.registerSingleton<IChangePasswordUseCase>(
    "IChangePasswordUseCase",
    ChangePasswordUseCase,
  );
  container.registerSingleton<IUpdateVehicleUseCase>(
    "IUpdateVehicleUseCase",
    UpdateVehicleUseCase,
  );
  container.registerSingleton<IGetCabDetailsUseCase>(
    "IGetCabDetailsUseCase",
    GetCabDetailsUseCase,
  );
  container.registerSingleton<IDeleteCabImageUseCase>(
    "IDeleteCabImageUseCase",
    DeleteCabImageUseCase,
  )
}
