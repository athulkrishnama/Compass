import { IForgetPasswordVerifyOtpRequestDTO } from "@domain/dtos/auth/forgetPassword.dto";
import { ICacheService } from "@domain/interfaces/service/cacheService.interface";
import { ITokenService } from "@domain/interfaces/service/tokenService.interface";
import { IForgetPasswordVerifyOtpUseCase } from "@domain/interfaces/useCase/auth/forgetPasswordVerifyOtpUseCase.interface";
import { AuthError } from "@useCases/constants/Errors";
import { inject, injectable } from "tsyringe";

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
      throw new Error(AuthError.OTP_EXPIRED_OR_NOT_REQUESTED);
    }

    if (otp !== cachedOtp) {
      throw new Error(AuthError.INVALID_OTP);
    }

    const token = this._tokenService.createToken();
    await this._cacheService.setWithExpiry(`FToken:${email}`, token, 15 * 60);
    await this._cacheService.deleteValue(`FOTP:${email}`);
    return token;
  }
}
