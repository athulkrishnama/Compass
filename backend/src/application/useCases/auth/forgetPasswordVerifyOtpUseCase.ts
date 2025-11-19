import { IForgetPasswordVerifyOtpRequestDTO } from "@domain/dtos/auth/forgetPassword.dto";
import { ICacheService } from "application/interfaces/service/cacheService.interface";
import { ITokenService } from "application/interfaces/service/tokenService.interface";
import { IForgetPasswordVerifyOtpUseCase } from "application/interfaces/useCase/auth/forgetPasswordVerifyOtpUseCase.interface";
import { inject, injectable } from "tsyringe";
import {
  InvalidOTPException,
  OTPExpiredException,
} from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";

@injectable()
export class ForgetPasswordVerifyOtpUseCase
  implements IForgetPasswordVerifyOtpUseCase
{
  constructor(
    @inject("ICacheService") private _cacheService: ICacheService,
    @inject("ITokenService") private _tokenService: ITokenService,
  ) {}
  async verify({
    email,
    otp,
  }: IForgetPasswordVerifyOtpRequestDTO): Promise<string> {
    const cachedOtp = await this._cacheService.getValue(`FOTP:${email}`);

    if (!cachedOtp) {
      throw new OTPExpiredException(
        INTERNAL_ERROR_MESSAGES.OTP_EXPIRED_OR_NOT_REQUESTED,
      );
    }

    if (otp !== cachedOtp) {
      throw new InvalidOTPException(INTERNAL_ERROR_MESSAGES.INVALID_OTP);
    }

    const token = this._tokenService.createToken();
    await this._cacheService.setWithExpiry(`FToken:${email}`, token, 15 * 60);
    await this._cacheService.deleteValue(`FOTP:${email}`);
    return token;
  }
}
