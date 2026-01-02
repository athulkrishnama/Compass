import {
  IChangeEmailVerifyOtpRequestDTO,
  IChangeEmailVerifyOtpResponseDTO,
} from "@domain/dtos/auth/changeEmail.dto";

export interface IChangeEmailVerifyOtpUseCase {
  execute(
    dto: IChangeEmailVerifyOtpRequestDTO,
  ): Promise<IChangeEmailVerifyOtpResponseDTO>;
}
