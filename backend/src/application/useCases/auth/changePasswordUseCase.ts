import {
  InvalidOperationException,
  PasswordNotMatchingException,
  UserNotFoundException,
} from "@application/constants/Exceptions";
import { IUserRepo } from "@application/interfaces/repository/users/user.repo.interface";
import { IHashService } from "@application/interfaces/service/hashService.interface";
import { IChangePasswordUseCase } from "@application/interfaces/useCase/auth/changePasswordUseCase.interface";
import { IChangePasswordRequestDTO } from "@domain/dtos/auth/changePassword.dto";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { inject, injectable } from "tsyringe";

@injectable()
export class ChangePasswordUseCase implements IChangePasswordUseCase {
  constructor(
    @inject("IUserRepo") private _userRepo: IUserRepo,
    @inject("IHashService") private _hashService: IHashService,
  ) {}

  async change({
    newPassword,
    oldPassword,
    userId,
  }: IChangePasswordRequestDTO): Promise<void> {
    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new UserNotFoundException(INTERNAL_ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (!user.password) {
      throw new InvalidOperationException(
        INTERNAL_ERROR_MESSAGES.SOCIAL_LOGIN_PASSWORD_CHANGE_ERROR,
      );
    }

    const passwordMatch = await this._hashService.compare(
      oldPassword,
      user.password,
    );

    if (!passwordMatch) {
      throw new PasswordNotMatchingException(
        INTERNAL_ERROR_MESSAGES.PASSWORD_NOT_MATCHING,
      );
    }

    const hashedPassword = await this._hashService.hash(newPassword);

    user.password = hashedPassword;

    await this._userRepo.update(user, userId);
  }
}
