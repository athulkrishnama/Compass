import { AuthError } from "@application/constants/Errors";
import {
  InvalideDataException,
  UserNotFoundException,
} from "@application/constants/Exceptions";
import { IUserRepo } from "@application/interfaces/repository/users/user.repo.interface";
import { IApproveUserVerificationRequestUseCase } from "@application/interfaces/useCase/admin/approveUserVerificationRequestUseCase.interface";
import { VERIFICATION_STATUSES } from "@domain/enums/verificationStatus";
import { inject, injectable } from "tsyringe";

@injectable()
export class ApproveUserVerificationRequestUseCase
  implements IApproveUserVerificationRequestUseCase
{
  constructor(@inject("IUserRepo") private _userRepo: IUserRepo) {}
  async approve(id: string): Promise<void> {
    const user = await this._userRepo.findById(id);

    if (!user) {
      throw new UserNotFoundException(AuthError.USER_NOT_FOUND);
    }

    if (user.is_verified !== VERIFICATION_STATUSES.PENDING) {
      throw new InvalideDataException("not verified");
    }

    user.is_verified = VERIFICATION_STATUSES.APPROVED;
    user.rejection_reason = "";

    await this._userRepo.update(user, id);
  }
}
