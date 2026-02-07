import { HTTP_STATUS_CODE } from "@domain/enums/statusCodes";
import { ICacheService } from "application/interfaces/service/cacheService.interface";
import { IJwtService } from "application/interfaces/service/jwtService.interface";
import { ROLES } from "@domain/types/roles";
import { HTTPResponseBuilder } from "presentation/utils/httpResponseBuilder";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IUserRepo } from "@application/interfaces/repository/users/user.repo.interface";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { VERIFICATION_STATUSES } from "@domain/enums/verificationStatus";

@injectable()
export class AuthMiddleware {
  constructor(
    @inject("IJwtService") private _jwtService: IJwtService,
    @inject("ICacheService") private _cacheService: ICacheService,
    @inject("IUserRepo") private _userRepo: IUserRepo,
  ) {}

  check = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.header("Authorization");

    if (!header?.startsWith("Bearer ")) {
      HTTPResponseBuilder.buildErrorResponse(
        req,
        res,
        HTTP_STATUS_CODE.UNAUTHORIZED,
        INTERNAL_ERROR_MESSAGES.INVALID_TOKEN_ERROR,
      );
      return;
    }
    const token = header.split(" ")[1];
    const decoded = this._jwtService.verifyAccessToken(token);
    if (!decoded) {
      HTTPResponseBuilder.buildErrorResponse(
        req,
        res,
        HTTP_STATUS_CODE.UNAUTHORIZED,
        INTERNAL_ERROR_MESSAGES.INVALID_TOKEN_ERROR,
      );
      return;
    }
    const blackListed = await this._cacheService.getValue(
      `blackList:${decoded.jti}`,
    );

    if (blackListed) {
      HTTPResponseBuilder.buildErrorResponse(
        req,
        res,
        HTTP_STATUS_CODE.UNAUTHORIZED,
        INTERNAL_ERROR_MESSAGES.INVALID_TOKEN_ERROR,
      );
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
      next(new Error(INTERNAL_ERROR_MESSAGES.UNAUTHORIZED));
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
        next(new Error(INTERNAL_ERROR_MESSAGES.BLOCKED));
      }

      next();
    };
  };

  checkVerified = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.user;

    let userStatus = await this._cacheService.getValue(`USER_VERIFIED:${id}`);

    if (!userStatus) {
      const user = await this._userRepo.findById(id);

      userStatus =
        user?.is_verified === VERIFICATION_STATUSES.APPROVED
          ? "verified"
          : "unverified";
      await this._cacheService.setWithExpiry(
        `USER_VERIFIED:${id}`,
        userStatus,
        60 * 15,
      );
    }

    if (userStatus === "unverified") {
      next(new Error(INTERNAL_ERROR_MESSAGES.UNVERIFIED));
    }

    next();
  };
}
