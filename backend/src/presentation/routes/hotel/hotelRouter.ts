import { NextFunction, Request, Response, Router } from "express";
import { authMiddleware, hotelController } from "@infrastructure/DI/resolve";
import { HotelRoutes } from "@presentation/constants/routes/hotelRoutes";
import { ROLES } from "@domain/enums/roles";
import { uploadMiddleware } from "@presentation/middlewares/multer";

export class HotelRouter {
  private _router: Router;
  constructor() {
    this._router = Router();
    this._setRoute();
  }

  _setRoute() {
    this._router.post(
      HotelRoutes.INDEX,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.HOTEL]),
      uploadMiddleware.fields([{ name: "images" }, { name: "coverImage" }]),
      (req: Request, res: Response, next: NextFunction) => {
        hotelController.handleCreateHotel(req, res, next);
      },
    );

    this._router.get(
      HotelRoutes.INDEX,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.HOTEL]),
      (req: Request, res: Response, next: NextFunction) => {
        hotelController.handleGetHotelsByUserId(req, res, next);
      },
    );
  }

  public getRouter() {
    return this._router;
  }
}
