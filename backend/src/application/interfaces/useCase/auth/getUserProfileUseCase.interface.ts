import { IGetUserProfileResponseDTO } from "@domain/dtos/auth/getUserProfile.dto";

export interface IGetUserProfileUseCase {
  execute(id: string): Promise<IGetUserProfileResponseDTO>;
}
