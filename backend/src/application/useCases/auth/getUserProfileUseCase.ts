import { AuthError } from "@application/constants/Errors";
import { UserNotFoundException } from "@application/constants/Exceptions";
import { IUserRepo } from "@application/interfaces/repository/users/user.repo.interface";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { IGetUserProfileUseCase } from "@application/interfaces/useCase/auth/getUserProfileUseCase.interface";
import { env } from "@config/envConfig";
import { IGetUserProfileResponseDTO } from "@domain/dtos/auth/getUserProfile.dto";
import { UserMapper } from "@mappers/user.mapper";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetUserProfileUseCase implements IGetUserProfileUseCase {
  constructor(
    @inject("IUserRepo") private _userRepo: IUserRepo,
    @inject("IStorageService") private _storageService: IStorageService,
  ) {}
  async execute(id: string): Promise<IGetUserProfileResponseDTO> {
    const user = await this._userRepo.findById(id);

    if (!user) {
      throw new UserNotFoundException(AuthError.USER_NOT_FOUND);
    }
    if (user.profile_image)
      user.profile_image = await this._storageService.createSignedUrl(
        user.profile_image,
        env.SIGNED_URL_EXPIRY,
      );
    if (user.verfication_id_image)
      user.verfication_id_image = await this._storageService.createSignedUrl(
        user.verfication_id_image,
        env.SIGNED_URL_EXPIRY,
      );

    return UserMapper.toGetUserProfileDTOfromEntity(user);
  }
}
