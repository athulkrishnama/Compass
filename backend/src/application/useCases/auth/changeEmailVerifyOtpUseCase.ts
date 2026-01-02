import { InvalideDataException } from "@application/constants/Exceptions";
import { IUserRepo } from "@application/interfaces/repository/users/user.repo.interface";
import { ICacheService } from "@application/interfaces/service/cacheService.interface";
import { ITokenService } from "@application/interfaces/service/tokenService.interface";
import { IChangeEmailVerifyOtpUseCase } from "@application/interfaces/useCase/auth/changeEmailVerifyOtpUseCase.interface";
import {
  IChangeEmailVerifyOtpRequestDTO,
  IChangeEmailVerifyOtpResponseDTO,
} from "@domain/dtos/auth/changeEmail.dto";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { inject, injectable } from "tsyringe";

@injectable()
export class ChangeEmailVerifyOtpUseCase
  implements IChangeEmailVerifyOtpUseCase
{
  constructor(
    @inject("IUserRepo") private _userRepository: IUserRepo,
    @inject("ICacheService") private _cacheService: ICacheService,
    @inject("ITokenService") private _tokenService: ITokenService,
  ) {}

  async execute({
    otp,
    userId,
  }: IChangeEmailVerifyOtpRequestDTO): Promise<IChangeEmailVerifyOtpResponseDTO> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (user.googleId) {
      throw new InvalideDataException(
        INTERNAL_ERROR_MESSAGES.SOCIAL_LOGIN_EMAIL_CHANGE_ERROR,
      );
    }

    const cachedOtp = await this._cacheService.getValue(
      `CHANGE_EMAIL_OTP:${userId}`,
    );
    if (!cachedOtp) {
      throw new InvalideDataException(
        INTERNAL_ERROR_MESSAGES.OTP_EXPIRED_OR_NOT_REQUESTED,
      );
    }

    if (cachedOtp !== otp) {
      throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_OTP);
    }

    await this._cacheService.deleteValue(`CHANGE_EMAIL_OTP:${userId}`);
    const token = this._tokenService.createToken();

    await this._cacheService.setWithExpiry(
      `CHANGE_EMAIL_TOKEN:${userId}`,
      token,
      60 * 10,
    );
    return {
      token,
    };
  }
}
