import {
  IUserLoginRequestDTO,
  IUserLoginResponseDTO,
} from "@domain/dtos/auth/userLogin.dto";

export interface ILoginUseCase {
  login(dto: IUserLoginRequestDTO): Promise<IUserLoginResponseDTO>;
}
