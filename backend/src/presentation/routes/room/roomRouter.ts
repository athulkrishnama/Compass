import { NextFunction, Request, Response, Router } from "express";
import { authMiddleware, roomController } from "@infrastructure/DI/resolve";
import { RoomRoutes } from "@presentation/constants/routes/roomRoutes";
import { ROLES } from "@domain/enums/roles";
import { uploadMiddleware } from "@presentation/middlewares/multer";

export class RoomRouter {
  private _router: Router;
  constructor() {
    this._router = Router();
    this._setRoute();
  }

  _setRoute() {
    this._router.post(
      RoomRoutes.BY_HOTEL,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.HOTEL]),
      uploadMiddleware.fields([{ name: "images" }, { name: "coverImage" }]),
      (req: Request, res: Response, next: NextFunction) => {
        roomController.handleCreateRoom(req, res, next);
      },
    );

    this._router.get(
      RoomRoutes.BY_HOTEL,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.HOTEL, ROLES.ADMIN]),
      (req: Request, res: Response, next: NextFunction) => {
        roomController.handleListRoomsByHotelId(req, res, next);
      },
    );

    this._router.get(
      RoomRoutes.BY_ID,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.HOTEL, ROLES.ADMIN]),
      (req: Request, res: Response, next: NextFunction) => {
        roomController.handleGetRoomById(req, res, next);
      },
    );

    this._router.patch(
      RoomRoutes.BY_ID,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.HOTEL]),
      uploadMiddleware.fields([{ name: "images" }, { name: "coverImage" }]),
      (req: Request, res: Response, next: NextFunction) => {
        roomController.handleEditRoom(req, res, next);
      },
    );

    this._router.delete(
      RoomRoutes.IMAGE,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.HOTEL]),
      (req: Request, res: Response, next: NextFunction) => {
        roomController.handleDeleteRoomImage(req, res, next);
      },
    );
  }

  public getRouter() {
    return this._router;
  }
}
