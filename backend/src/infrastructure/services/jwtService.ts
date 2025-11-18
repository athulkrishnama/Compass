import { IJwtService } from "application/interfaces/service/jwtService.interface";
import { JWTPayloadType } from "@domain/types/JWTPayload";
import { env } from "@config/envConfig";
import { sign, verify } from "jsonwebtoken";
import { injectable } from "tsyringe";
import { JWTDecodeType } from "@domain/types/JWTDecode";
import { v4 } from "uuid";
import { TokenExpiredException } from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";

@injectable()
export class JwtService implements IJwtService {
  createAccessToken(payload: JWTPayloadType): string {
    return sign(payload, env.ACCESS_TOKEN_SECRET, {
      expiresIn: env.ACCESS_TOKEN_EXPIRATION_TIME,
      jwtid: v4(),
    });
  }
  createRefreshToken(payload: JWTPayloadType): string {
    return sign(payload, env.REFRESH_TOKEN_SECRET, {
      expiresIn: env.REFRESH_TOKEN_EXPIRATION_TIME,
      jwtid: v4(),
    });
  }
  verifyAccessToken(token: string): JWTDecodeType | null {
    try {
      const { id, jti, role } = verify(
        token,
        env.ACCESS_TOKEN_SECRET,
      ) as JWTDecodeType;

      if (!(id && jti && role)) {
        throw new Error(INTERNAL_ERROR_MESSAGES.TOKEN_DATA_MISSING);
      }

      return { id, jti, role };
    } catch (err) {
      void err;
      throw new TokenExpiredException(
        INTERNAL_ERROR_MESSAGES.INVALID_TOKEN_ERROR,
      );
    }
  }

  verifyRefreshToken(token: string): JWTDecodeType | null {
    const { id, jti, role } = verify(
      token,
      env.REFRESH_TOKEN_SECRET,
    ) as JWTDecodeType;

    if (!(id && jti && role)) {
      throw new Error(INTERNAL_ERROR_MESSAGES.TOKEN_DATA_MISSING);
    }

    return { id, jti, role };
  }
}
