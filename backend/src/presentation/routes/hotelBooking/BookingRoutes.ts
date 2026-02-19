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
      BookingRoutes.GET_ONGOING_BOOKINGS,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.TRAVELER]),
      (req, res, next) =>
        bookingController.getTravelerOngoingBookings(req, res, next),
    );

    this._router.get(
      BookingRoutes.GET_COMPLETED_BOOKINGS,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.TRAVELER]),
      (req, res, next) =>
        bookingController.getTravelerCompletedBookings(req, res, next),
    );

    this._router.get(
      BookingRoutes.GET_BOOKING_DETAILS,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.TRAVELER]),
      (req, res, next) => bookingController.getBookingDetails(req, res, next),
    );

    this._router.get(
      BookingRoutes.GET_BOOKING_BY_PAYMENT_ID,
      (req, res, next) =>
        bookingController.getBookingByPaymentId(req, res, next),
    );

    this._router.patch(
      BookingRoutes.CANCEL_BOOKING,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.TRAVELER]),
      (req, res, next) => bookingController.cancelBooking(req, res, next),
    );

    this._router.get(
      BookingRoutes.OVERALL_DASHBOARD,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.HOTEL]),
      (req, res, next) => bookingController.getOverallDashboard(req, res, next),
    );

    this._router.get(
      BookingRoutes.HOTEL_DASHBOARD,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.HOTEL]),
      (req, res, next) => bookingController.getHotelDashboard(req, res, next),
    );

    this._router.get(
      BookingRoutes.GET_HOTEL_BOOKINGS,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.HOTEL]),
      (req, res, next) => bookingController.getHotelBookings(req, res, next),
    );

    this._router.get(
      BookingRoutes.GET_AVAILABLE_ROOMS,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.HOTEL]),
      (req, res, next) => bookingController.getAvailableRooms(req, res, next),
    );

    this._router.patch(
      BookingRoutes.CHECK_IN,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.HOTEL]),
      (req, res, next) => bookingController.checkIn(req, res, next),
    );

    this._router.patch(
      BookingRoutes.CHECK_OUT,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.HOTEL]),
      (req, res, next) => bookingController.checkOut(req, res, next),
    );
  }

  getRouter(): Router {
    return this._router;
  }
}
