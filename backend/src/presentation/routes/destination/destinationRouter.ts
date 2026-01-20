import { ROLES } from "@domain/enums/roles";
import {
  authMiddleware,
  destinationController,
} from "@infrastructure/DI/resolve";
import { DESTINATION_ROUTES } from "@presentation/constants/routes/destinationRoutes";
import { uploadMiddleware } from "@presentation/middlewares/multer";
import { NextFunction, Request, Response, Router } from "express";

export class DestinationRouter {
  private _router: Router;

  constructor() {
    this._router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this._router.post(
      DESTINATION_ROUTES.INDEX,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.ADMIN]),
      uploadMiddleware.fields([{ name: "images" }, { name: "coverImage" }]),
      (req: Request, res: Response, next: NextFunction) => {
        destinationController.handleCreateDestination(req, res, next);
      },
    );

    this._router.get(
      DESTINATION_ROUTES.INDEX,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.ADMIN]),
      (req: Request, res: Response, next: NextFunction) => {
        destinationController.handleListDestinations(req, res, next);
      },
    );

    this._router.patch(
      `${DESTINATION_ROUTES.INDEX}:id`,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.ADMIN]),
      uploadMiddleware.fields([{ name: "images" }, { name: "coverImage" }]),
      (req: Request, res: Response, next: NextFunction) => {
        destinationController.handleUpdateDestination(req, res, next);
      },
    );

    this._router.get(
      DESTINATION_ROUTES.LIST,
      (req: Request, res: Response, next: NextFunction) => {
        destinationController.handleGetDestination(req, res, next);
      },
    );

    this._router.get(
      `${DESTINATION_ROUTES.INDEX}:id`,
      (req: Request, res: Response, next: NextFunction) => {
        destinationController.handleFindDestinationById(req, res, next);
      },
    );

    this._router.delete(
      DESTINATION_ROUTES.DESTINATION_IMAGE,
      authMiddleware.check,
      authMiddleware.authorizeRole([ROLES.ADMIN]),
      (req: Request, res: Response, next: NextFunction) => {
        destinationController.handleDeleteDestinationImage(req, res, next);
      },
    );
  }

  public getRouter(): Router {
    return this._router;
  }
}
