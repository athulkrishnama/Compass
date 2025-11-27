import { IChangePasswordRequestDTO } from "@domain/dtos/auth/changePassword.dto";

export interface IChangePasswordUseCase {
  change(dto: IChangePasswordRequestDTO): Promise<void>;
}
