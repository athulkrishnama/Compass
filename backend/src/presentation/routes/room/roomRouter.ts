import { ROLES } from "@domain/enums/roles";
import { authMiddleware, roomController } from "@infrastructure/DI/resolve";
import { ROOM_ROUTES } from "@presentation/constants/routes/roomRoutes";
import { Router } from "express";

export class RoomRouter {
  private _router: Router;
  constructor() {
    this._router = Router();
    this._setRoutes();
  }

  _setRoutes() {
    this._router.post(
      ROOM_ROUTES.INDEX,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.HOTEL]),
      roomController.handleCreateRoom,
    );
    this._router.patch(
      `${ROOM_ROUTES.INDEX}:id`,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.HOTEL]),
      roomController.handleEditRoom,
    );
  }

  getRouter() {
    return this._router;
  }
}
