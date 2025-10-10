import { IVerifyOTPRequestDTO } from "@domain/dtos/auth/verifyOTP.dto";
import { IUserRepo } from "application/interfaces/repository/users/user.repo.interface";
import { ICacheService } from "application/interfaces/service/cacheService.interface";
import { IVerifyOtpUseCase } from "application/interfaces/useCase/auth/verifyOtpUseCase.interface";
import { UserMapper } from "application/mappers/user.mapper";
import { AuthError } from "@application/constants/Errors";
import { inject, injectable } from "tsyringe";

@injectable()
export class SignupVerifyOtpUseCase implements IVerifyOtpUseCase {
  constructor(
    @inject("IUserRepo") private _userRepo: IUserRepo,
    @inject("ICacheService") private _cacheService: ICacheService,
  ) {}
  async verify({ email, otp }: IVerifyOTPRequestDTO): Promise<boolean> {
    const cachedOtp = await this._cacheService.getValue(`OTP:${email}`);

    if (!cachedOtp) {
      throw new Error(AuthError.OTP_EXPIRED_OR_NOT_REQUESTED);
    }

    if (cachedOtp != otp) {
      throw new Error(AuthError.INVALID_OTP);
    }

    const userData = await this._cacheService.getValue(`SIGNUPDATA:${email}`);

    if (!userData) {
      throw new Error(AuthError.USER_DATA_MISSIING_IN_CACHE);
    }

    const userEntity = UserMapper.toEntityFromString(userData);

    const saved = await this._userRepo.create(userEntity);

    await Promise.all([
      this._cacheService.deleteValue(`OTP:${email}`),
      this._cacheService.deleteValue(`SIGNUPDATA:${email}`),
    ]);

    if (saved) return true;
    return false;
  }
}
