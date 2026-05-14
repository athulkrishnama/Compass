import {
  authMiddleware,
  notificationController,
} from "@infrastructure/DI/resolve";
import { NOTIFICATION_ROUTES } from "@presentation/constants/routes/notificationRoutes";
import { Router } from "express";

export class NotificationRouter {
  private _router: Router;
  constructor() {
    this._router = Router();
    this._setRoute();
  }

  _setRoute() {
    this._router.get("/", authMiddleware.check, (req, res, next) => {
      notificationController.handleGetNotifications(req, res, next);
    });

    this._router.get(
      NOTIFICATION_ROUTES.UNREAD_COUNT,
      authMiddleware.check,
      (req, res, next) => {
        notificationController.handleGetUnreadCount(req, res, next);
      },
    );

    this._router.patch(
      NOTIFICATION_ROUTES.MARK_READ,
      authMiddleware.check,
      (req, res, next) => {
        notificationController.handleMarkAsRead(req, res, next);
      },
    );

    this._router.patch(
      NOTIFICATION_ROUTES.MARK_ALL_READ,
      authMiddleware.check,
      (req, res, next) => {
        notificationController.handleMarkAllAsRead(req, res, next);
      },
    );
  }

  getRouter() {
    return this._router;
  }
}
