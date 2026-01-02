import { InvalideDataException } from "@application/constants/Exceptions";
import { IUserRepo } from "@application/interfaces/repository/users/user.repo.interface";
import { ICacheService } from "@application/interfaces/service/cacheService.interface";
import { IChangeEmailNewEmailUseCase } from "@application/interfaces/useCase/auth/changeEmailNewEmailUseCase.interface";
import { IChangeEmailNewEmailRequestDTO } from "@domain/dtos/auth/changeEmail.dto";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { inject, injectable } from "tsyringe";

@injectable()
export class ChangeEmailNewEmailUseCase implements IChangeEmailNewEmailUseCase {
  constructor(
    @inject("IUserRepo") private _userRepository: IUserRepo,
    @inject("ICacheService") private _cacheService: ICacheService,
  ) {}
  async execute({
    newEmail,
    token,
    userId,
  }: IChangeEmailNewEmailRequestDTO): Promise<void> {
    const cachedToken = await this._cacheService.getValue(
      `CHANGE_EMAIL_TOKEN:${userId}`,
    );
    if (!cachedToken) {
      throw new InvalideDataException(
        INTERNAL_ERROR_MESSAGES.OTP_EXPIRED_OR_NOT_REQUESTED,
      );
    }

    if (cachedToken !== token) {
      throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_OTP);
    }

    await this._cacheService.deleteValue(`CHANGE_EMAIL_TOKEN:${userId}`);
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const existingUser = await this._userRepository.findByEmail(newEmail);
    if (existingUser) {
      throw new InvalideDataException(
        INTERNAL_ERROR_MESSAGES.AUTH_EXISTING_EMAIL_ERROR,
      );
    }
    user.email = newEmail;
    await this._userRepository.update(user, userId);
  }
}
