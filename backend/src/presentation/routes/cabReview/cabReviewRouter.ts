import { Router } from "express";
import { ROLES } from "@domain/enums/roles";
import {
  authMiddleware,
  cabReviewController,
} from "@infrastructure/DI/resolve";

import { CAB_REVIEW_ROUTES } from "@presentation/constants/routes/cabReviewRoutes";

export class CabReviewRouter {
  private _router: Router;

  constructor() {
    this._router = Router();
    this._setRoutes();
  }

  private _setRoutes() {
    this._router.post(
      CAB_REVIEW_ROUTES.CREATE,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.TRAVELER]),
      (req, res, next) => {
        cabReviewController.handleCreateCabReview(req, res, next);
      },
    );

    this._router.get(
      CAB_REVIEW_ROUTES.ELIGIBILITY,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.TRAVELER]),
      (req, res, next) => {
        cabReviewController.handleCheckEligibility(req, res, next);
      },
    );

    this._router.get(
      CAB_REVIEW_ROUTES.DRIVER,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.CAB]),
      (req, res, next) => {
        cabReviewController.handleGetDriverReviews(req, res, next);
      },
    );

    this._router.get(
      CAB_REVIEW_ROUTES.ADMIN,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.ADMIN]),
      (req, res, next) => {
        cabReviewController.handleGetAllCabReviews(req, res, next);
      },
    );
  }

  getRouter() {
    return this._router;
  }
}
