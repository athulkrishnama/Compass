import { adminController, authMiddleware } from "@DI/resolve";
import { AdminRoutes } from "@infrastructure/constants/routes/adminRoutes";
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
      (req: Request, res: Response, next: NextFunction) => {
        adminController.handleGetUsers(req, res, next);
      },
    );

    this._router.post(
      AdminRoutes.STATUS,
      authMiddleware.check,
      (req: Request, res: Response, next: NextFunction) => {
        adminController.handleUserStatusChange(req, res, next);
      },
    );
  }

  public getRouter() {
    return this._router;
  }
}
