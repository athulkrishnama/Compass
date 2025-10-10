import { ITokenService } from "application/interfaces/service/tokenService.interface";
import { v7 } from "uuid";

export class TokenService implements ITokenService {
  createToken(): string {
    return v7();
  }
}
