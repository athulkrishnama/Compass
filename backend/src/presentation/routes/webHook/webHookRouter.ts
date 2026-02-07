import { webhookController } from "@infrastructure/DI/resolve";
import { WEBHOOK_ROUTES } from "@presentation/constants/routes/webhookRoutes";
import express from "express";
import { Router } from "express";

export class WebHookRouter {
  private _router: Router;

  constructor() {
    this._router = Router();
    this._setRoutes();
  }

  private _setRoutes() {
    this._router.post(
      WEBHOOK_ROUTES.STRIPE,
      express.raw({ type: "application/json" }),
      (req, res, next) => {
        webhookController.handleWebhook(req, res, next);
      },
    );
  }

  getRouter(): Router {
    return this._router;
  }
}
