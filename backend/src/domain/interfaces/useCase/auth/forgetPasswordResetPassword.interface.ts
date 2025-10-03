import { IForgetPasswordResetPasswordRequestDTO } from "@domain/dtos/auth/forgetPassword.dto";

export interface IForgetPasswordResetPasswordUseCase {
  reset(dto: IForgetPasswordResetPasswordRequestDTO): Promise<void>;
}
