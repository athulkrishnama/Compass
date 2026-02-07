import { authMiddleware, paymentController } from "@infrastructure/DI/resolve";
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
  }

  getRouter(): Router {
    return this._router;
  }
}
