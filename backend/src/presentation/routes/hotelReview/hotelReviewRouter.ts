import { Router } from "express";
import { ROLES } from "@domain/enums/roles";
import {
  authMiddleware,
  hotelReviewController,
} from "@infrastructure/DI/resolve";
import { HOTEL_REVIEW_ROUTES } from "@presentation/constants/routes/hotelReviewRoutes";

export class HotelReviewRouter {
  private _router: Router;

  constructor() {
    this._router = Router();
    this._setRoutes();
  }

  private _setRoutes() {
    this._router.post(
      HOTEL_REVIEW_ROUTES.CREATE,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.TRAVELER]),
      (req, res, next) => {
        hotelReviewController.handleCreateHotelReview(req, res, next);
      },
    );

    this._router.get(
      HOTEL_REVIEW_ROUTES.ELIGIBILITY,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.TRAVELER]),
      (req, res, next) => {
        hotelReviewController.handleCheckEligibility(req, res, next);
      },
    );

    this._router.get(
      HOTEL_REVIEW_ROUTES.HOTEL_REVIEWS,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.TRAVELER, ROLES.HOTEL]),
      (req, res, next) => {
        hotelReviewController.handleGetHotelReviews(req, res, next);
      },
    );

    this._router.get(
      HOTEL_REVIEW_ROUTES.OWNER,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.HOTEL]),
      (req, res, next) => {
        hotelReviewController.handleGetOwnerHotelReviews(req, res, next);
      },
    );

    this._router.get(
      HOTEL_REVIEW_ROUTES.ADMIN,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.ADMIN]),
      (req, res, next) => {
        hotelReviewController.handleGetAllHotelReviews(req, res, next);
      },
    );
  }

  getRouter() {
    return this._router;
  }
}
