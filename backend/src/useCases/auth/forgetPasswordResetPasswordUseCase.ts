import { IForgetPasswordResetPasswordRequestDTO } from "@domain/dtos/auth/forgetPassword.dto";
import { IUserRepo } from "@domain/interfaces/repository/users/user.repo.interface.";
import { ICacheService } from "@domain/interfaces/service/cacheService.interface";
import { IHashService } from "@domain/interfaces/service/hashService.interface";
import { IForgetPasswordResetPasswordUseCase } from "@domain/interfaces/useCase/auth/forgetPasswordResetPassword.interface";
import { AuthError } from "@useCases/constants/Errors";
import { inject, injectable } from "tsyringe";

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
      throw new Error(AuthError.TOKEN_EXPIRED);
    }

    if (cachedToken !== token) {
      throw new Error(AuthError.TOKEN_NOT_MATCHING);
    }

    const hashedPassword = await this._hashService.hash(password);

    await this._userRepo.findByIdAndUpdatePassword(email, hashedPassword);
    await this._cacheService.deleteValue(`FToken:${email}`);
  }
}
