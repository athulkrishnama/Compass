import { HTTP_STATUS_CODE } from "@domain/constants/statusCodes";
import { ICacheService } from "@domain/interfaces/service/cacheService.interface";
import { IJwtService } from "@domain/interfaces/service/jwtService.interface";
import { AuthError } from "@infrastructure/constants/AuthErrors";
import { HTTPResponseBuilder } from "@utils/httpResponseBuilder";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

@injectable()
export class AuthMiddleware {
  constructor(
    @inject("IJwtService") private _jwtService: IJwtService,
    @inject("ICacheService") private _cacheService: ICacheService,
  ) {}

  check = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.header("Authorization");

    const invalidTokenResponse = HTTPResponseBuilder.buildErrorResponse(
      HTTP_STATUS_CODE.UNAUTHORIZED,
      AuthError.INVALID_TOKEN_ERROR,
    );

    if (!header?.startsWith("Bearer ")) {
      res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(invalidTokenResponse);
      return;
    }
    const token = header.split(" ")[1];
    const decoded = this._jwtService.verifyAccessToken(token);
    if (!decoded) {
      res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(invalidTokenResponse);
      return;
    }
    const blackListed = await this._cacheService.getValue(
      `blackList:${decoded.jti}`,
    );

    if (blackListed) {
      res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(invalidTokenResponse);
      return;
    }

    (req as any).user = { role: decoded.role, id: decoded.id };
    next();
  };
}
