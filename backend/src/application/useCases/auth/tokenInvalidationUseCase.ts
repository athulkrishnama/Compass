import { env } from "@config/envConfig";
import { ICacheService } from "application/interfaces/service/cacheService.interface";
import { IJwtService } from "application/interfaces/service/jwtService.interface";
import { ITokenInvalidationUseCase } from "application/interfaces/useCase/auth/tokenInvalidationUseCase.interface";
import { inject, injectable } from "tsyringe";

@injectable()
export class TokenInvalidationUseCase implements ITokenInvalidationUseCase {
  constructor(
    @inject("ICacheService") private _cacheService: ICacheService,
    @inject("IJwtService") private _jwtService: IJwtService,
  ) {}

  async validate(token: string): Promise<void> {
    const decoded = this._jwtService.verifyAccessToken(token);

    if (!decoded) return;

    const tokenId = decoded.jti;

    await this._cacheService.setWithExpiry(
      `blackList:${tokenId}`,
      "blackListed",
      env.ACCESS_TOKEN_EXPIRATION_TIME,
    );
  }
}
