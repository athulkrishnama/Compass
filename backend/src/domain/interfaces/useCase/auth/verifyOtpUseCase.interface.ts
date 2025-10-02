import { IVerifyOTPRequestDTO } from "@domain/dtos/auth/verifyOTP.dto";

export interface IVerifyOtpUseCase {
  verify(dto: IVerifyOTPRequestDTO): Promise<boolean>;
}
