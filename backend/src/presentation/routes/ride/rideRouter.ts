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

    this._router.get(
      RIDE_ROUTES.DRIVER_ACTIVE_RIDE,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.CAB]),
      (req, res, next) => {
        rideController.handleGetActiveRideDetails(req, res, next);
      },
    );

    this._router.get(
      RIDE_ROUTES.PAST_TRIPS,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.TRAVELER]),
      (req, res, next) => {
        rideController.handleGetRiderPastTrips(req, res, next);
      },
    );

    this._router.get(
      "/:id",
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.TRAVELER, ROLES.CAB]),
      (req, res, next) => {
        rideController.handleGetRideDetails(req, res, next);
      },
    );

    this._router.get(
      RIDE_ROUTES.CAB_DETAILS,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.TRAVELER, ROLES.CAB]),
      (req, res, next) => {
        rideController.handleGetRideCabDetails(req, res, next);
      },
    );
  }

  getRouter() {
    return this._router;
  }
}
