import { bookingController } from "@infrastructure/DI/resolve";
import { BookingRoutes } from "@presentation/constants/routes/bookingRoutes";
import { Router } from "express";

export class BookingRouter {
  private _router: Router;

  constructor() {
    this._router = Router();
    this._setRoutes();
  }

  private _setRoutes() {
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
