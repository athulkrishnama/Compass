import { IVerifyOTPRequestDTO } from "@domain/dtos/auth/verifyOTP.dto";
import { IUserRepo } from "application/interfaces/repository/users/user.repo.interface";
import { ICacheService } from "application/interfaces/service/cacheService.interface";
import { IVerifyOtpUseCase } from "application/interfaces/useCase/auth/verifyOtpUseCase.interface";
import { UserMapper } from "application/mappers/user.mapper";
import { inject, injectable } from "tsyringe";
import {
  ConflictException,
  InvalidOTPException,
  OTPExpiredException,
  UserDataMissingException,
} from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { ROLES } from "@domain/enums/roles";
import { ICabRepo } from "@application/interfaces/repository/cab/cab.repo.interface";

@injectable()
export class SignupVerifyOtpUseCase implements IVerifyOtpUseCase {
  constructor(
    @inject("IUserRepo") private _userRepo: IUserRepo,
    @inject("ICacheService") private _cacheService: ICacheService,
    @inject("ICabRepo") private _cabRepo: ICabRepo,
  ) {}
  async verify({ email, otp }: IVerifyOTPRequestDTO): Promise<boolean> {
    const cachedOtp = await this._cacheService.getValue(`OTP:${email}`);

    if (!cachedOtp) {
      throw new OTPExpiredException(
        INTERNAL_ERROR_MESSAGES.AUTH_EXISTING_EMAIL_ERROR,
      );
    }

    if (cachedOtp != otp) {
      throw new InvalidOTPException(INTERNAL_ERROR_MESSAGES.INVALID_OTP);
    }

    const userData = await this._cacheService.getValue(`SIGNUPDATA:${email}`);

    if (!userData) {
      throw new UserDataMissingException(
        INTERNAL_ERROR_MESSAGES.CACHE_DATA_MISSING,
      );
    }

    const userEntity = UserMapper.toEntityFromString(userData);

    const saved = await this._userRepo.create(userEntity);

    if (userEntity.role === ROLES.CAB) {
      const cab = await this._cabRepo.findByUserId(userEntity._id!);
      if (cab) {
        throw new ConflictException(INTERNAL_ERROR_MESSAGES.CAB_ALREADY_EXISTS);
      }
      await this._cabRepo.create({
        userId: saved,
        isOnline: false,
      });
    }
    await Promise.all([
      this._cacheService.deleteValue(`OTP:${email}`),
      this._cacheService.deleteValue(`SIGNUPDATA:${email}`),
    ]);

    if (saved) return true;
    return false;
  }
}
