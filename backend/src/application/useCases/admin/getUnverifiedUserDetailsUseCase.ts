import { AuthError } from "@application/constants/Errors";
import { UserNotFoundException } from "@application/constants/Exceptions";
import { IUserRepo } from "@application/interfaces/repository/users/user.repo.interface";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { IGetUnverifiedUserDetailsUseCase } from "@application/interfaces/useCase/admin/getUnverifiedUserDetailsUseCase.interface";
import { env } from "@config/envConfig";
import { IGetUnverifedUserDetailsResponseDTO } from "@domain/dtos/admin/getUnverifiedUserDetails.dto";
import { UserMapper } from "@mappers/user.mapper";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetUnverifiedUserDetailsUseCase
  implements IGetUnverifiedUserDetailsUseCase
{
  constructor(
    @inject("IUserRepo") private _userRepo: IUserRepo,
    @inject("IStorageService") private _storageService: IStorageService,
  ) {}

  async get(id: string): Promise<IGetUnverifedUserDetailsResponseDTO> {
    const user = await this._userRepo.findById(id);

    if (!user) {
      throw new UserNotFoundException(AuthError.USER_NOT_FOUND);
    }

    if (user.verfication_id_image) {
      user.verfication_id_image = await this._storageService.createSignedUrl(
        user.verfication_id_image,
        env.SIGNED_URL_EXPIRY,
      );
    }

    if (user.profile_image) {
      user.profile_image = await this._storageService.createSignedUrl(
        user.profile_image,
        env.SIGNED_URL_EXPIRY,
      );
    }
    return UserMapper.toGetUnverifedUserDetailsResponseDTOfromEntity(user);
  }
}
