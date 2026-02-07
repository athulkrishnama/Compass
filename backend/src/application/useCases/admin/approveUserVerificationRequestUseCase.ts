import {
  InvalideDataException,
  UserNotFoundException,
} from "@application/constants/Exceptions";
import { IUserRepo } from "@application/interfaces/repository/users/user.repo.interface";
import { ICacheService } from "@application/interfaces/service/cacheService.interface";
import { IApproveUserVerificationRequestUseCase } from "@application/interfaces/useCase/admin/approveUserVerificationRequestUseCase.interface";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { VERIFICATION_STATUSES } from "@domain/enums/verificationStatus";
import { inject, injectable } from "tsyringe";

@injectable()
export class ApproveUserVerificationRequestUseCase
  implements IApproveUserVerificationRequestUseCase
{
  constructor(
    @inject("IUserRepo") private _userRepo: IUserRepo,
    @inject("ICacheService") private _cacheService: ICacheService,
  ) {}
  async approve(id: string): Promise<void> {
    const user = await this._userRepo.findById(id);

    if (!user) {
      throw new UserNotFoundException(INTERNAL_ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (user.is_verified !== VERIFICATION_STATUSES.PENDING) {
      throw new InvalideDataException(
        INTERNAL_ERROR_MESSAGES.CANNOT_CHANGE_STATUS,
      );
    }

    user.is_verified = VERIFICATION_STATUSES.APPROVED;
    user.rejection_reason = "";

    this._cacheService.deleteValue(`USER_VERIFIED:${id}`);

    await this._userRepo.update(user, id);
  }
}
