import { Router, Request, Response, NextFunction } from "express";
import { walletController, authMiddleware } from "@infrastructure/DI/resolve";
import { WalletRoutes } from "@presentation/constants/routes/walletRoutes";
import { ROLES } from "@domain/enums/roles";

export class WalletRouter {
  private _router: Router;

  constructor() {
    this._router = Router();
    this._setRoutes();
  }

  private _setRoutes() {
    this._router.get(
      WalletRoutes.SUMMARY,
      authMiddleware.check,
      authMiddleware.authorizeRole([
        ROLES.TRAVELER,
        ROLES.HOTEL,
        ROLES.CAB,
        ROLES.ADMIN,
      ]),
      (req: Request, res: Response, next: NextFunction) => {
        walletController.getWalletSummary(req, res, next);
      },
    );

    this._router.get(
      WalletRoutes.TRANSACTIONS,
      authMiddleware.check,
      authMiddleware.authorizeRole([
        ROLES.TRAVELER,
        ROLES.HOTEL,
        ROLES.CAB,
        ROLES.ADMIN,
      ]),
      (req: Request, res: Response, next: NextFunction) => {
        walletController.getWalletTransactions(req, res, next);
      },
    );

    this._router.post(
      WalletRoutes.TOP_UP,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.TRAVELER]),
      (req: Request, res: Response, next: NextFunction) => {
        walletController.topUpWallet(req, res, next);
      },
    );
  }

  public getRouter() {
    return this._router;
  }
}
