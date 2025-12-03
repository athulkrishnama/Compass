import { ROLES } from "@domain/enums/roles";
import { authMiddleware, cabController } from "@infrastructure/DI/resolve";
import { CAB_ROUTES } from "@presentation/constants/routes/cabRoutes";
import { uploadMiddleware } from "@presentation/middlewares/multer";
import { NextFunction, Request, Response, Router } from "express";

export class CabRouter {
  private _router: Router;
  constructor() {
    this._router = Router();
    this._setRoute();
  }


  _setRoute() {
    this._router.get(
      "/",
      authMiddleware.check,
      authMiddleware.checkBlocked(),
      authMiddleware.authorizeRole([ROLES.CAB]),
      (req: Request, res: Response, next: NextFunction) =>
        cabController.handleGetCabDetails(req, res, next),
    );

    this._router.patch(
      CAB_ROUTES.VEHICLE,
      authMiddleware.check,
      authMiddleware.checkBlocked(),
      authMiddleware.authorizeRole([ROLES.CAB]),
      uploadMiddleware.fields([{ name: "images", maxCount: 5 }]),
      (req: Request, res: Response, next: NextFunction) => {
        cabController.handleVehicleUpdate(req, res, next);
      },
    );
  }

  public getRouter() {
    return this._router;
  }
}
