import { AuthRoutes } from "@infrastructure/constants/routes/authRoutes";
import { authController } from "@DI/resolve";
import { NextFunction, Request, Response, Router } from "express";

export class AuthRouter {
  private _router: Router;

  constructor() {
    this._router = Router();
    this._setRoute();
  }

  private _setRoute() {
    this._router.post(
      AuthRoutes.REGISTER,
      (req: Request, res: Response, next: NextFunction) => {
        authController.handleUserRegistration(req, res, next);
      },
    );

    this._router.post(
      AuthRoutes.VERIFY,
      (req: Request, res: Response, next: NextFunction) => {
        authController.handleUserRegistrationVerifyOtp(req, res, next);
      },
    );
  }

  public get_router() {
    return this._router;
  }
}
