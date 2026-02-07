import {
  InvalideDataException,
  UserNotFoundException,
} from "@application/constants/Exceptions";
import { IUserRepo } from "@application/interfaces/repository/users/user.repo.interface";
import { ICacheService } from "@application/interfaces/service/cacheService.interface";
import { IRejectUserVerificationRequestUseCase } from "@application/interfaces/useCase/admin/rejectUserVerificationRequestUseCase.interface";
import { IRejectUserVerificationRequestRequestDTO } from "@domain/dtos/admin/rejectUserVerificationRequest.dto";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { VERIFICATION_STATUSES } from "@domain/enums/verificationStatus";
import { inject, injectable } from "tsyringe";

@injectable()
export class RejectUserVerificationRequestUseCase
  implements IRejectUserVerificationRequestUseCase
{
  constructor(
    @inject("IUserRepo") private _userRepo: IUserRepo,
    @inject("ICacheService") private _cacheService: ICacheService,
  ) {}
  async reject(dto: IRejectUserVerificationRequestRequestDTO): Promise<void> {
    const user = await this._userRepo.findById(dto.userId);

    if (!user) {
      throw new UserNotFoundException(INTERNAL_ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (user.is_verified !== VERIFICATION_STATUSES.PENDING) {
      throw new InvalideDataException(
        INTERNAL_ERROR_MESSAGES.CANNOT_CHANGE_STATUS,
      );
    }

    user.is_verified = VERIFICATION_STATUSES.REJECTED;
    user.rejection_reason = dto.reason;

    this._cacheService.deleteValue(`USER_VERIFIED:${dto.userId}`);

    await this._userRepo.update(user, dto.userId);
  }
}
