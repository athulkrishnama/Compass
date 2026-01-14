import { adminController, authMiddleware } from "@infrastructure/DI/resolve";
import { ROLES } from "@domain/enums/roles";
import { AdminRoutes } from "presentation/constants/routes/adminRoutes";
import { NextFunction, Request, Response, Router } from "express";
import { uploadMiddleware } from "@presentation/middlewares/multer";

export class AdminRouter {
  private _router: Router;

  constructor() {
    this._router = Router();
    this._setRoutes();
  }

  private _setRoutes() {
    this._router.get(
      AdminRoutes.USERS,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.ADMIN]),
      (req: Request, res: Response, next: NextFunction) => {
        adminController.handleGetUsers(req, res, next);
      },
    );

    this._router.patch(
      AdminRoutes.STATUS,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.ADMIN]),
      (req: Request, res: Response, next: NextFunction) => {
        adminController.handleUserStatusChange(req, res, next);
      },
    );

    this._router.get(
      AdminRoutes.VERIFICATION,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.ADMIN]),
      (req: Request, res: Response, next: NextFunction) => {
        adminController.handleGetUnverifiedUsers(req, res, next);
      },
    );

    this._router.get(
      `${AdminRoutes.VERIFICATION}/:id`,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.ADMIN]),
      (req: Request, res: Response, next: NextFunction) => {
        adminController.handleGetUnverifiedUserDetails(req, res, next);
      },
    );

    this._router.patch(
      AdminRoutes.APPROVE_USER,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.ADMIN]),
      (req: Request, res: Response, next: NextFunction) => {
        adminController.handleVerifyUser(req, res, next);
      },
    );

    this._router.patch(
      AdminRoutes.REJECT_USER,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.ADMIN]),
      (req: Request, res: Response, next: NextFunction) => {
        adminController.handleRejectUser(req, res, next);
      },
    );

    this._router.post(
      AdminRoutes.DESTINATIONS,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.ADMIN]),
      uploadMiddleware.fields([{ name: "images" }, { name: "coverImage" }]),
      (req: Request, res: Response, next: NextFunction) => {
        adminController.handleCreateDestination(req, res, next);
      },
    );

    this._router.get(
      AdminRoutes.DESTINATIONS,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.ADMIN]),
      (req: Request, res: Response, next: NextFunction) => {
        adminController.handleListDestinations(req, res, next);
      },
    );

    this._router.patch(
      `${AdminRoutes.DESTINATIONS}/:id`,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.ADMIN]),
      uploadMiddleware.fields([{ name: "images" }, { name: "coverImage" }]),
      (req: Request, res: Response, next: NextFunction) => {
        adminController.handleUpdateDestination(req, res, next);
      },
    );

    this._router.get(
      `${AdminRoutes.DESTINATIONS}/:id`,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.ADMIN]),
      (req: Request, res: Response, next: NextFunction) => {
        adminController.handleFindDestinationById(req, res, next);
      },
    );

    this._router.delete(
      AdminRoutes.DESTINATION_IMAGE,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.ADMIN]),
      (req: Request, res: Response, next: NextFunction) => {
        adminController.handleDeleteDestinationImage(req, res, next);
      },
    );
  }

  public getRouter() {
    return this._router;
  }
}
