import { HTTP_STATUS_CODE } from "@domain/enums/statusCodes";
import { ICacheService } from "application/interfaces/service/cacheService.interface";
import { IJwtService } from "application/interfaces/service/jwtService.interface";
import { ROLES } from "@domain/types/roles";
import { AuthError } from "presentation/constants/AuthErrors";
import { HTTPResponseBuilder } from "presentation/utils/httpResponseBuilder";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IUserRepo } from "@application/interfaces/repository/users/user.repo.interface";
import { UserIsBlockedException } from "@application/constants/Exceptions";

@injectable()
export class AuthMiddleware {
  constructor(
    @inject("IJwtService") private _jwtService: IJwtService,
    @inject("ICacheService") private _cacheService: ICacheService,
    @inject("IUserRepo") private _userRepo: IUserRepo,
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
    req.user = { id: decoded.id, role: decoded.role };
    next();
  };

  authorizeRole = (roles: ROLES[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;
      const curRole = user.role;
      if (roles.includes(curRole)) return next();
      next(new Error(AuthError.UNAUTHORIZED));
    };
  };

  checkBlocked = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.user;

      let userStatus = await this._cacheService.getValue(`USER_STATUS:${id}`);

      if (!userStatus) {
        const status = await this._userRepo.getUserStatus(id);

        userStatus = status ? "blocked" : "active";
        await this._cacheService.setWithExpiry(
          `USER_STATUS:${id}`,
          userStatus,
          60 * 15,
        );
      }

      if (userStatus === "blocked") {
        throw new UserIsBlockedException(AuthError.BLOCKED);
      }

      next();
    };
  };
}
