import {
  IUserLoginRequestDTO,
  IUserLoginResponseDTO,
} from "@domain/dtos/auth/userLogin.dto";
import { IUserRepo } from "application/interfaces/repository/users/user.repo.interface";
import { IHashService } from "application/interfaces/service/hashService.interface";
import { ILoginUseCase } from "application/interfaces/useCase/auth/loginUseCase.interface";
import { UserMapper } from "application/mappers/user.mapper";
import { inject, injectable } from "tsyringe";
import {
  PasswordNotMatchingException,
  UserIsBlockedException,
  UserNotFoundException,
} from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";

@injectable()
export class LoginUseCase implements ILoginUseCase {
  constructor(
    @inject("IUserRepo") private _userRepo: IUserRepo,
    @inject("IHashService") private _hashService: IHashService,
  ) {}
  async login({
    email,
    password,
  }: IUserLoginRequestDTO): Promise<IUserLoginResponseDTO> {
    const user = await this._userRepo.findByEmail(email);

    if (!user) {
      throw new UserNotFoundException(INTERNAL_ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (user.is_blocked) {
      throw new UserIsBlockedException(INTERNAL_ERROR_MESSAGES.USER_IS_BLOCKED);
    }

    if (!user.password) {
      if (user.googleId) {
        throw new PasswordNotMatchingException(
          INTERNAL_ERROR_MESSAGES.INVALID_LOGIN_TYPE,
        );
      }
      throw new PasswordNotMatchingException(
        INTERNAL_ERROR_MESSAGES.PASSWORD_NOT_MATCHING,
      );
    }
    const passwordMatch = await this._hashService.compare(
      password,
      user.password,
    );

    if (!passwordMatch) {
      throw new PasswordNotMatchingException(
        INTERNAL_ERROR_MESSAGES.PASSWORD_NOT_MATCHING,
      );
    }

    const dto = UserMapper.toLoginUserResponseDTOfromEntity(user);

    return dto;
  }
}
