import { ROLES } from "@domain/enums/roles";
import { authMiddleware, rideController } from "@infrastructure/DI/resolve";
import { RIDE_ROUTES } from "@presentation/constants/routes/rideRoutes";
import { Router } from "express";

export class RideRouter {
  private _router: Router;
  constructor() {
    this._router = Router();
    this._setRoute();
  }

  _setRoute() {
    this._router.post(
      RIDE_ROUTES.FARE,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.TRAVELER]),
      (req, res, next) => {
        rideController.handleCreateFare(req, res, next);
      },
    );

    this._router.post(
      RIDE_ROUTES.SEARCH,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.TRAVELER]),
      (req, res, next) => {
        rideController.handleCreateRide(req, res, next);
      },
    );
  }

  getRouter() {
    return this._router;
  }
}
