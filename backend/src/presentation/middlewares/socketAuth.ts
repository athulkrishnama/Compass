import { IJwtService } from "@application/interfaces/service/jwtService.interface";
import { inject, injectable } from "tsyringe";

@injectable()
export class SocketAuth {
  constructor(@inject("IJwtService") private _jwtService: IJwtService) {}

  async authenticate(token: string) {
    return this._jwtService.verifyAccessToken(token);
  }
}
