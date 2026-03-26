import { ROLES } from "@domain/enums/roles";
import { authMiddleware, fareController } from "@infrastructure/DI/resolve";
import { FARE_ROUTES } from "@presentation/constants/routes/fareRoutes";
import { NextFunction, Request, Response, Router } from "express";

export class FareRouter {
  private _router: Router;
  constructor() {
    this._router = Router();
    this._setRoute();
  }

  _setRoute() {
    this._router.post(
      FARE_ROUTES.CALCULATE,
      authMiddleware.check,
      authMiddleware.checkBlocked(),
      authMiddleware.authorizeRole([ROLES.TRAVELER]),
      (req: Request, res: Response, next: NextFunction) =>
        fareController.handleCalculateFare(req, res, next),
    );
  }

  public getRouter() {
    return this._router;
  }
}
