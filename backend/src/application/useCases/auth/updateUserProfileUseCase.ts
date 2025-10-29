import { AuthError } from "@application/constants/Errors";
import { UserNotFoundException } from "@application/constants/Exceptions";
import { StorageFolderNames } from "@application/constants/storageFolderNames";
import { IUserRepo } from "@application/interfaces/repository/users/user.repo.interface";
import { IStorageService } from "@application/interfaces/service/storageService.interface";
import { IUpdateUserProfileUseCase } from "@application/interfaces/useCase/auth/updateUserProfileUseCase.interface";
import { IUpdateUserProfileRequestDTO } from "@domain/dtos/auth/updateUserProfile.dto";
import { inject, injectable } from "tsyringe";

@injectable()
export class UpdateUserProfileUseCase implements IUpdateUserProfileUseCase {
  constructor(
    @inject("IUserRepo") private _userRepo: IUserRepo,
    @inject("IStorageService") private _storageService: IStorageService,
  ) {}
  async update({
    full_name,
    profile_image,
    verification_id_image,
    id,
  }: IUpdateUserProfileRequestDTO): Promise<void> {
    const user = await this._userRepo.findById(id);
    if (!user?._id) {
      throw new UserNotFoundException(AuthError.USER_NOT_FOUND);
    }
    if (full_name) user.full_name = full_name;

    if (profile_image) {
      user.profile_image = await this._storageService.upload(
        profile_image,
        StorageFolderNames.PROFILE_IMAGE + "/" + id + Date.now(),
      );
    }

    if (verification_id_image && !user.is_verified) {
      user.verfication_id_image = await this._storageService.upload(
        verification_id_image,
        StorageFolderNames.VERIFICATION_DOCUMENT + "/" + id + Date.now(),
      );
    }

    await this._userRepo.update(user, user._id);
  }
}
