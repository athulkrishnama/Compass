import { IJwtService } from "application/interfaces/service/jwtService.interface";
import { IRefreshTokenUseCase } from "application/interfaces/useCase/auth/refreshTokenUseCase.interface";
import { AuthError } from "@application/constants/Errors";
import { inject, injectable } from "tsyringe";
import { TokenExpiredException } from "@application/constants/Exceptions";

@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(@inject("IJwtService") private _jwtService: IJwtService) {}

  async refresh(token: string): Promise<string> {
    const decoded = this._jwtService.verifyRefreshToken(token);

    if (!decoded) {
      throw new TokenExpiredException(AuthError.REFRESH_TOKEN_EXPIRED);
    }

    const accessToken = this._jwtService.createAccessToken({
      id: decoded.id,
      role: decoded.role,
    });

    return accessToken;
  }
}
