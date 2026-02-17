import { authMiddleware, bookingController } from "@infrastructure/DI/resolve";
import { BookingRoutes } from "@presentation/constants/routes/bookingRoutes";
import { Router } from "express";
import { ROLES } from "@domain/enums/roles";

export class BookingRouter {
  private _router: Router;

  constructor() {
    this._router = Router();
    this._setRoutes();
  }

  private _setRoutes() {
    this._router.get(
      BookingRoutes.GET_UPCOMING_BOOKINGS,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.TRAVELER]),
      (req, res, next) =>
        bookingController.getTravelerUpcomingBookings(req, res, next),
    );

    this._router.get(
      BookingRoutes.GET_COMPLETED_BOOKINGS,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.TRAVELER]),
      (req, res, next) =>
        bookingController.getTravelerCompletedBookings(req, res, next),
    );
    this._router.get(
      BookingRoutes.GET_BOOKING_BY_PAYMENT_ID,
      (req, res, next) =>
        bookingController.getBookingByPaymentId(req, res, next),
    );
  }

  getRouter(): Router {
    return this._router;
  }
}
