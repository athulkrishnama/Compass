import { authMiddleware, paymentController } from "@infrastructure/DI/resolve";
import { ROLES } from "@domain/enums/roles";
import { PAYMENT_ROUTES } from "@presentation/constants/routes/paymentRoutes";
import { Router } from "express";

export class PaymentRouter {
  private _router: Router;
  constructor() {
    this._router = Router();
    this._setRoutes();
  }

  private _setRoutes() {
    this._router.post(
      PAYMENT_ROUTES.CREATE_PAYMENT_INTENT,
      authMiddleware.check,
      (req, res, next) => {
        paymentController.handleCreatePaymentIntent(req, res, next);
      },
    );

    this._router.post(
      PAYMENT_ROUTES.CAB_INITIATE,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.TRAVELER]),
      (req, res, next) => {
        paymentController.handleInitiateCabPayment(req, res, next);
      },
    );

    this._router.post(
      PAYMENT_ROUTES.CAB_WALLET,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.TRAVELER]),
      (req, res, next) => {
        paymentController.handleProcessWalletCabPayment(req, res, next);
      },
    );

    this._router.post(
      PAYMENT_ROUTES.CAB_CASH,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.CAB]),
      (req, res, next) => {
        paymentController.handleRecordCashPayment(req, res, next);
      },
    );

    this._router.get(
      PAYMENT_ROUTES.CAB_STATUS,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.TRAVELER, ROLES.CAB]),
      (req, res, next) => {
        paymentController.handleGetCabPaymentStatus(req, res, next);
      },
    );
  }

  getRouter(): Router {
    return this._router;
  }
}
