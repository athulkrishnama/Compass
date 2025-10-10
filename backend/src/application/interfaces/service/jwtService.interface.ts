import { JWTDecodeType } from "@domain/types/JWTDecode";
import { JWTPayloadType } from "@domain/types/JWTPayload";

export interface IJwtService {
  createAccessToken(payload: JWTPayloadType): string;
  createRefreshToken(payload: JWTPayloadType): string;
  verifyAccessToken(token: string): JWTDecodeType | null;
  verifyRefreshToken(token: string): JWTDecodeType | null;
}
