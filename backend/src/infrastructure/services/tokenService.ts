import { ITokenService } from "@domain/interfaces/service/tokenService.interface";
import { v7 } from "uuid";

export class TokenService implements ITokenService {
  createToken(): string {
    return v7();
  }
}
