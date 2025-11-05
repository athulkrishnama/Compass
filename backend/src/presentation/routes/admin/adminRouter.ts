import { adminController, authMiddleware } from "@infrastructure/DI/resolve";
import { ROLES } from "@domain/enums/roles";
import { AdminRoutes } from "presentation/constants/routes/adminRoutes";
import { NextFunction, Request, Response, Router } from "express";

export class AdminRouter {
  private _router: Router;

  constructor() {
    this._router = Router();
    this._setRoutes();
  }

  private _setRoutes() {
    this._router.get(
      AdminRoutes.USERS,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.ADMIN]),
      (req: Request, res: Response, next: NextFunction) => {
        adminController.handleGetUsers(req, res, next);
      },
    );

    this._router.patch(
      AdminRoutes.STATUS,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.ADMIN]),
      (req: Request, res: Response, next: NextFunction) => {
        adminController.handleUserStatusChange(req, res, next);
      },
    );

    this._router.get(
      AdminRoutes.VERIFICATION,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.ADMIN]),
      (req: Request, res: Response, next: NextFunction) => {
        adminController.handleGetUnverifiedUsers(req, res, next);
      },
    );
  }

  public getRouter() {
    return this._router;
  }
}
