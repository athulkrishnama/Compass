import { IForgetPasswordVerifyOtpRequestDTO } from "@domain/dtos/auth/forgetPassword.dto";

export interface IForgetPasswordVerifyOtpUseCase {
  verify(dto: IForgetPasswordVerifyOtpRequestDTO): Promise<string>;
}
