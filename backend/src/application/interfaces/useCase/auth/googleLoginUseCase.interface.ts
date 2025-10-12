import {
  IGoogleLoginRequestDTO,
  IGoogleLoginResponseDTO,
} from "@domain/dtos/auth/googleLogin.dto";

export interface IGoogleLoginUseCase {
  execute(dto: IGoogleLoginRequestDTO): Promise<IGoogleLoginResponseDTO>;
}
