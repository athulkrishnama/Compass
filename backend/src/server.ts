import express, { Express, Response, Request } from "express";
import { env } from "./config/envConfig";
import { Errors } from "./presentation/constants/Error";
import { Messages } from "./presentation/constants/messages";
import cors from "cors";
import { Routes } from "./presentation/constants/routes/baseRoutes";
import { setErrorHandlingMiddleware } from "./presentation/middlewares/loggingMiddleware";
import { corsOptions } from "./presentation/constants/corsOptions";
import { AuthRouter } from "./presentation/routes/auth/authRouter";
import { errorHandlingMiddleware } from "./presentation/middlewares/errorHandlingMiddleware";
import { NextFunction } from "express-serve-static-core";
import { AdminRouter } from "presentation/routes/admin/adminRouter";
import cookieParser from "cookie-parser";
import "@config/i18nConfig";
import middleware from "i18next-http-middleware";
import i18next from "i18next";
import { CabRouter } from "@presentation/routes/cab/cabRouter";
import { HotelRouter } from "@presentation/routes/hotel/hotelRouter";
import { RoomVariantRouter } from "@presentation/routes/roomVariant/roomVariantRouter";
import { DestinationRouter } from "@presentation/routes/destination/destinationRouter";
import { PaymentRouter } from "@presentation/routes/payment/paymentRouter";
import { WebHookRouter } from "@presentation/routes/webHook/webHookRouter";

export class Server {
  private _app: Express;

  constructor() {
    this._app = express();
    this._setLoggingMiddleware();
    this._setWebHookRouter();
    this._setMiddlewares();
    this._setAuthRouter();
    this._setAdminRouter();
    this._setCabRouter();
    this._setHotelRouter();
    this._setRoomVariantRouter();
    this._setPaymentRouter();
    this._setDestinationRouter();
    this._setErrorHandlingMiddleware();
  }

  private _setAuthRouter() {
    const authRouter = new AuthRouter();
    this._app.use(Routes.AUTH, authRouter.get_router());
  }

  private _setAdminRouter() {
    const adminRouter = new AdminRouter();
    this._app.use(Routes.ADMIN, adminRouter.getRouter());
  }

  private _setCabRouter() {
    const cabRouter = new CabRouter();
    this._app.use(Routes.CAB, cabRouter.getRouter());
  }

  private _setHotelRouter() {
    const hotelRouter = new HotelRouter();
    this._app.use(Routes.HOTEL, hotelRouter.getRouter());
  }

  private _setRoomVariantRouter() {
    const roomVariantRouter = new RoomVariantRouter();
    this._app.use(Routes.ROOM_VARIANT, roomVariantRouter.getRouter());
  }

  private _setDestinationRouter() {
    const destinationRouter = new DestinationRouter();
    this._app.use(Routes.DESTINATION, destinationRouter.getRouter());
  }

  private _setPaymentRouter() {
    const paymentRouter = new PaymentRouter();
    this._app.use(Routes.PAYMENT, paymentRouter.getRouter());
  }

  private _setWebHookRouter() {
    const webHookRouter = new WebHookRouter();
    this._app.use(middleware.handle(i18next));
    this._app.use(Routes.WEBHOOK, webHookRouter.getRouter());
  }

  private _setMiddlewares() {
    this._app.use(express.json());
    this._app.use(express.urlencoded());
    this._app.use(cors(corsOptions));
    this._app.use(cookieParser());
    this._app.use(middleware.handle(i18next));
  }

  private _setErrorHandlingMiddleware() {
    this._app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        errorHandlingMiddleware(err, req, res, next);
      },
    );
  }

  private _setLoggingMiddleware() {
    setErrorHandlingMiddleware(this._app);
  }

  public listen() {
    this._app.listen(env.PORT, (err) => {
      if (err) {
        console.log(Errors.SERVER_STARTING_ERROR);
      }
      console.log(Messages.SERVER_STARTED_SUCCESSFULLY);
    });
  }
}
