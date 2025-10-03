import {
  IUserLoginRequestDTO,
  IUserLoginResponseDTO,
} from "@domain/dtos/auth/userLogin.dto";
import { IUserRepo } from "@domain/interfaces/repository/users/user.repo.interface.";
import { IHashService } from "@domain/interfaces/service/hashService.interface";
import { ILoginUseCase } from "@domain/interfaces/useCase/auth/loginUseCase.interface";
import { UserMapper } from "@mappers/user.mapper";
import { AuthError } from "@useCases/constants/Errors";
import { inject, injectable } from "tsyringe";

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
      throw new Error(AuthError.USER_NOT_FOUND);
    }

    if (user.is_blocked) {
      throw new Error(AuthError.USER_IS_BLOCKED);
    }

    const passwordMatch = await this._hashService.compare(
      password,
      user.password,
    );

    if (!passwordMatch) {
      throw new Error(AuthError.PASSWORD_NOT_MATCHING);
    }

    const dto = UserMapper.toLoginUserResponseDTOfromEntity(user);

    return dto;
  }
}
