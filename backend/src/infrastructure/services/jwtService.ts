import { IJwtService } from "@domain/interfaces/service/jwtService.interface";
import { JWTPayloadType } from "@domain/types/JWTPayload";
import { env } from "@config/envConfig";
import { sign, verify } from "jsonwebtoken";
import { injectable } from "tsyringe";

@injectable()
export class JwtService implements IJwtService {
  createAccessToken(payload: JWTPayloadType): string {
    return sign(payload, env.ACCESS_TOKEN_SECRET, {
      expiresIn: env.ACCESS_TOKEN_EXPIRATION_TIME,
    });
  }
  createRefreshToken(payload: JWTPayloadType): string {
    return sign(payload, env.REFRESH_TOKEN_SECRET, {
      expiresIn: env.REFRESH_TOKEN_EXPIRATION_TIME,
    });
  }
  verifyAccessToken(token: string): JWTPayloadType | null {
    return verify(token, env.ACCESS_TOKEN_SECRET) as JWTPayloadType;
  }
  verifyRefreshToken(token: string): JWTPayloadType | null {
    return verify(token, env.REFRESH_TOKEN_SECRET) as JWTPayloadType;
  }
}
