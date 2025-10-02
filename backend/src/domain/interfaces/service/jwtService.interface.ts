import { JWTPayloadType } from "@domain/types/JWTPayload";

export interface IJwtService {
  createAccessToken(payload: JWTPayloadType): string;
  createRefreshToken(payload: JWTPayloadType): string;
  verifyAccessToken(token: string): JWTPayloadType | null;
  verifyRefreshToken(token: string): JWTPayloadType | null;
}
