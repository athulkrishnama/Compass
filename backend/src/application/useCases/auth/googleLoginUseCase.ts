import { IUserRepo } from "@application/interfaces/repository/users/user.repo.interface";
import { IGoogleAuthService } from "@application/interfaces/service/googleAuthService.interface";
import { IGoogleLoginUseCase } from "@application/interfaces/useCase/auth/googleLoginUseCase.interface";
import {
  IGoogleLoginRequestDTO,
  IGoogleLoginResponseDTO,
} from "@domain/dtos/auth/googleLogin.dto";
import { UserMapper } from "@mappers/user.mapper";
import { inject, injectable } from "tsyringe";

@injectable()
export class GoogleLoginUseCase implements IGoogleLoginUseCase {
  constructor(
    @inject("IUserRepo") private _userRepo: IUserRepo,
    @inject("IGoogleAuthService")
    private _googleAuthService: IGoogleAuthService,
  ) {}

  async execute({
    authorizationCode,
    role,
  }: IGoogleLoginRequestDTO): Promise<IGoogleLoginResponseDTO> {
    const { email, googleId, full_name } =
      await this._googleAuthService.authorize(authorizationCode);

    let user = await this._userRepo.findByEmail(email);

    if (!user) {
      user = {
        email,
        full_name,
        role,
        is_blocked: false,
        googleId,
        is_verified: false,
      };
      const id = await this._userRepo.googleSignUp(user);
      user._id = id;
    }

    return UserMapper.toLoginUserResponseDTOfromEntity(user);
  }
}
