import { AuthError } from "@application/constants/Errors";
import {
  InvalideDataException,
  UserNotFoundException,
} from "@application/constants/Exceptions";
import { IUserRepo } from "@application/interfaces/repository/users/user.repo.interface";
import { IRejectUserVerificationRequestUseCase } from "@application/interfaces/useCase/admin/rejectUserVerificationRequestUseCase.interface";
import { IRejectUserVerificationRequestRequestDTO } from "@domain/dtos/admin/rejectUserVerificationRequest.dto";
import { VERIFICATION_STATUSES } from "@domain/enums/verificationStatus";
import { inject, injectable } from "tsyringe";

@injectable()
export class RejectUserVerificationRequestUseCase
  implements IRejectUserVerificationRequestUseCase
{
  constructor(@inject("IUserRepo") private _userRepo: IUserRepo) {}
  async reject(dto: IRejectUserVerificationRequestRequestDTO): Promise<void> {
    const user = await this._userRepo.findById(dto.userId);

    if (!user) {
      throw new UserNotFoundException(AuthError.USER_NOT_FOUND);
    }

    if (user.is_verified !== VERIFICATION_STATUSES.PENDING) {
      throw new InvalideDataException("not verified");
    }

    user.is_verified = VERIFICATION_STATUSES.REJECTED;
    user.rejection_reason = dto.reason;

    await this._userRepo.update(user, dto.userId);
  }
}
