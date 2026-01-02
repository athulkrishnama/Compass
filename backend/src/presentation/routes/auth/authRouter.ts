import { AuthRoutes } from "presentation/constants/routes/authRoutes";
import { authController, authMiddleware } from "@infrastructure/DI/resolve";
import { NextFunction, Request, Response, Router } from "express";
import { uploadMiddleware } from "@presentation/middlewares/multer";

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

    this._router.post(
      AuthRoutes.RESEND_OTP,
      (req: Request, res: Response, next: NextFunction) => {
        authController.handleUserRegistrationResendOtp(req, res, next);
      },
    );

    this._router.post(
      AuthRoutes.LOGIN,
      (req: Request, res: Response, next: NextFunction) => {
        authController.handleUserLogin(req, res, next);
      },
    );

    this._router.post(
      AuthRoutes.FORGET_PASSWORD,
      (req: Request, res: Response, next: NextFunction) => {
        authController.handleForgetPasswordSendOtp(req, res, next);
      },
    );

    this._router.post(
      AuthRoutes.FORGET_PASSWORD_VERIFY_OTP,
      (req: Request, res: Response, next: NextFunction) => {
        authController.handleForgetPasswordVerifyOtp(req, res, next);
      },
    );

    this._router.post(
      AuthRoutes.FORGET_PASSWORD_RESET,
      (req: Request, res: Response, next: NextFunction) => {
        authController.handleForgetpasswordPasswordReset(req, res, next);
      },
    );

    this._router.post(
      AuthRoutes.REFRESH,
      (req: Request, res: Response, next: NextFunction) => {
        authController.handleTokenRefresh(req, res, next);
      },
    );

    this._router.post(
      AuthRoutes.LOGOUT,
      (req: Request, res: Response, next: NextFunction) => {
        authController.handleLogout(req, res, next);
      },
    );

    this._router.post(
      AuthRoutes.GOOGLE_LOGIN,
      (req: Request, res: Response, next: NextFunction) => {
        authController.handleGoogleLogin(req, res, next);
      },
    );

    this._router
      .get(
        AuthRoutes.PROFILE,
        authMiddleware.check,
        authMiddleware.checkBlocked(),
        (req: Request, res: Response, next: NextFunction) =>
          authController.handleGetProfile(req, res, next),
      )
      .patch(
        AuthRoutes.PROFILE,
        authMiddleware.check,
        authMiddleware.checkBlocked(),
        uploadMiddleware.fields([
          { name: "profile_image", maxCount: 1 },
          { name: "verification_id_image", maxCount: 1 },
        ]),
        (req: Request, res: Response, next: NextFunction) =>
          authController.handleUpdateProfile(req, res, next),
      );

    this._router.patch(
      AuthRoutes.CHANGE_PASSWORD,
      authMiddleware.check,
      authMiddleware.checkBlocked(),
      (req: Request, res: Response, next: NextFunction) =>
        authController.handleChangePassword(req, res, next),
    );

    this._router.patch(
      AuthRoutes.CHANGE_EMAIL_REQUEST_OTP,
      authMiddleware.check,
      authMiddleware.checkBlocked(),
      (req: Request, res: Response, next: NextFunction) =>
        authController.handleChangeEmailRequestOtp(req, res, next),
    );

    this._router.patch(
      AuthRoutes.CHANGE_EMAIL_VERIFY_OTP,
      authMiddleware.check,
      authMiddleware.checkBlocked(),
      (req: Request, res: Response, next: NextFunction) =>
        authController.handleChangeEmailVerifyOtp(req, res, next),
    );

    this._router.patch(
      AuthRoutes.CHANGE_EMAIL_NEW_EMAIL,
      authMiddleware.check,
      authMiddleware.checkBlocked(),
      (req: Request, res: Response, next: NextFunction) =>
        authController.handleChangeEmailNewEmail(req, res, next),
    );
  }

  public get_router() {
    return this._router;
  }
}
