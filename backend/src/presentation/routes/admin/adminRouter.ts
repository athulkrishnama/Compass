import {
  adminController,
  walletController,
  authMiddleware,
} from "@infrastructure/DI/resolve";
import { ROLES } from "@domain/enums/roles";
import { AdminRoutes } from "presentation/constants/routes/adminRoutes";
import { NextFunction, Request, Response, Router } from "express";

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

    this._router.get(
      AdminRoutes.TRANSACTIONS,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.ADMIN]),
      (req: Request, res: Response, next: NextFunction) => {
        walletController.getAdminTransactions(req, res, next);
      },
    );

    this._router.get(
      AdminRoutes.DASHBOARD_STATS,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.ADMIN]),
      (req: Request, res: Response, next: NextFunction) => {
        adminController.handleGetDashboardStats(req, res, next);
      },
    );

    this._router.get(
      AdminRoutes.HOTEL_REPORT,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.ADMIN]),
      (req: Request, res: Response, next: NextFunction) => {
        adminController.getHotelReport(req, res, next);
      },
    );

    this._router.get(
      AdminRoutes.HOTEL_REPORT_PDF,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.ADMIN]),
      (req: Request, res: Response, next: NextFunction) => {
        adminController.getHotelReportPdf(req, res, next);
      },
    );

    this._router.get(
      AdminRoutes.CAB_REPORT,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.ADMIN]),
      (req: Request, res: Response, next: NextFunction) => {
        adminController.getCabReport(req, res, next);
      },
    );

    this._router.get(
      AdminRoutes.CAB_REPORT_PDF,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.ADMIN]),
      (req: Request, res: Response, next: NextFunction) => {
        adminController.getCabReportPdf(req, res, next);
      },
    );
  }

  public getRouter() {
    return this._router;
  }
}
