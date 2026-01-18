import { NextFunction, Request, Response, Router } from "express";
import {
  authMiddleware,
  roomVariantController,
} from "@infrastructure/DI/resolve";
import { RoomVariantRoutes } from "@presentation/constants/routes/roomVariantRoutes";
import { ROLES } from "@domain/enums/roles";
import { uploadMiddleware } from "@presentation/middlewares/multer";

export class RoomVariantRouter {
  private _router: Router;
  constructor() {
    this._router = Router();
    this._setRoute();
  }

  _setRoute() {
    this._router.post(
      RoomVariantRoutes.BY_HOTEL,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.HOTEL]),
      uploadMiddleware.fields([{ name: "images" }, { name: "coverImage" }]),
      (req: Request, res: Response, next: NextFunction) => {
        roomVariantController.handleCreateRoomVariant(req, res, next);
      },
    );

    this._router.get(
      RoomVariantRoutes.BY_HOTEL,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.HOTEL, ROLES.ADMIN]),
      (req: Request, res: Response, next: NextFunction) => {
        roomVariantController.handleListRoomVariantsByHotelId(req, res, next);
      },
    );

    this._router.get(
      RoomVariantRoutes.BY_ID,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.HOTEL, ROLES.ADMIN]),
      (req: Request, res: Response, next: NextFunction) => {
        roomVariantController.handleGetRoomVariantById(req, res, next);
      },
    );

    this._router.patch(
      RoomVariantRoutes.BY_ID,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.HOTEL]),
      uploadMiddleware.fields([{ name: "images" }, { name: "coverImage" }]),
      (req: Request, res: Response, next: NextFunction) => {
        roomVariantController.handleEditRoomVariant(req, res, next);
      },
    );

    this._router.delete(
      RoomVariantRoutes.IMAGE,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.HOTEL]),
      (req: Request, res: Response, next: NextFunction) => {
        roomVariantController.handleDeleteRoomVariantImage(req, res, next);
      },
    );
  }

  public getRouter() {
    return this._router;
  }
}
