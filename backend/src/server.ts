import express, { Express, Response, Request } from "express";
import { env } from "./config/envConfig";
import { Errors } from "./infrastructure/constants/Error";
import { Messages } from "./infrastructure/constants/messages";
import cors from "cors";
import { Routes } from "./infrastructure/constants/routes/baseRoutes";
import { setErrorHandlingMiddleware } from "./infrastructure/middlewares/loggingMiddleware";
import { corsOptions } from "./infrastructure/constants/corsOptions";
import { AuthRouter } from "./infrastructure/routes/auth/authRouter";
import { errorHandlingMiddleware } from "./infrastructure/middlewares/errorHandlingMiddleware";
import { NextFunction } from "express-serve-static-core";

export class Server {
  private _app: Express;

  constructor() {
    this._app = express();
    this._setLoggingMiddleware();
    this._setMiddlewares();
    this._setAuthRouter();
    this._setErrorHandlingMiddleware();
  }

  private _setAuthRouter() {
    const authRouter = new AuthRouter();
    this._app.use(Routes.AUTH, authRouter.get_router());
  }

  private _setMiddlewares() {
    this._app.use(express.json());
    this._app.use(express.urlencoded());
    this._app.use(cors(corsOptions));
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
