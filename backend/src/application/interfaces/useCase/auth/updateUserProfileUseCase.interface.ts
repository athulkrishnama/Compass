import { IUpdateUserProfileRequestDTO } from "@domain/dtos/auth/updateUserProfile.dto";

export interface IUpdateUserProfileUseCase {
  update(dto: IUpdateUserProfileRequestDTO): Promise<void>;
}
