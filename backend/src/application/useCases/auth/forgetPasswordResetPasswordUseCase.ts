import { IForgetPasswordResetPasswordRequestDTO } from "@domain/dtos/auth/forgetPassword.dto";
import { IUserRepo } from "application/interfaces/repository/users/user.repo.interface";
import { ICacheService } from "application/interfaces/service/cacheService.interface";
import { IHashService } from "application/interfaces/service/hashService.interface";
import { IForgetPasswordResetPasswordUseCase } from "application/interfaces/useCase/auth/forgetPasswordResetPassword.interface";
import { AuthError } from "@application/constants/Errors";
import { inject, injectable } from "tsyringe";
import { TokenExpiredException } from "@application/constants/Exceptions";

@injectable()
export class ForgetPasswordResetPasswordUseCase
  implements IForgetPasswordResetPasswordUseCase
{
  constructor(
    @inject("ICacheService") private _cacheService: ICacheService,
    @inject("IHashService") private _hashService: IHashService,
    @inject("IUserRepo") private _userRepo: IUserRepo,
  ) {}

  async reset({
    email,
    password,
    token,
  }: IForgetPasswordResetPasswordRequestDTO): Promise<void> {
    const cachedToken = await this._cacheService.getValue(`FToken:${email}`);

    if (!cachedToken) {
      throw new TokenExpiredException(AuthError.TOKEN_EXPIRED);
    }

    if (cachedToken !== token) {
      throw new TokenExpiredException(AuthError.TOKEN_NOT_MATCHING);
    }

    const hashedPassword = await this._hashService.hash(password);

    await this._userRepo.findByIdAndUpdatePassword(email, hashedPassword);
    await this._cacheService.deleteValue(`FToken:${email}`);
  }
}
