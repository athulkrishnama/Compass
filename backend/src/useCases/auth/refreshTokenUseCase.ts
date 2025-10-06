import { IJwtService } from "@domain/interfaces/service/jwtService.interface";
import { IRefreshTokenUseCase } from "@domain/interfaces/useCase/auth/refreshTokenUseCase.interface";
import { AuthError } from "@useCases/constants/Errors";
import { inject, injectable } from "tsyringe";

@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(@inject("IJwtService") private _jwtService: IJwtService) {}

  async refresh(token: string): Promise<string> {
    const decoded = this._jwtService.verifyRefreshToken(token);

    if (!decoded) {
      throw new Error(AuthError.REFRESH_TOKEN_EXPIRED);
    }

    const accessToken = this._jwtService.createAccessToken({
      id: decoded.id,
      role: decoded.role,
    });

    return accessToken;
  }
}
