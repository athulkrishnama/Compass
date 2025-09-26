import express, { Express, Request, Response } from "express";
import { env } from "./config/envConfig";
import { Errors } from "@infrastructure/constants/Error";
import { Messages } from "@infrastructure/constants/messages";
import morgan from "morgan";
import { createRotatingFileStream } from "./utils/rfs";
import path from "path";
import cors from "cors";
import { Routes } from "@infrastructure/constants/routes/baseRoutes";

export class Server {
  private _app: Express;

  constructor() {
    this._app = express();
    this._setLoggingMiddleware();
    this._setMiddlewares();
    this._setAuthRouter();
  }

  private _setAuthRouter() {
    this._app.use(Routes.AUTH);
  }

  private _setMiddlewares() {
    this._app.use(express.json());
    this._app.use(express.urlencoded());
    this._app.use(
      cors({
        origin: env.ORIGIN_URL,
        credentials: true,
      }),
    );
  }

  private _setLoggingMiddleware() {
    if (env.NODE_ENV === "DEVELOPMENT") {
      this._app.use(morgan("combined"));
    } else {
      const accessLogStream = createRotatingFileStream(
        "1d",
        7,
        path.join(__dirname, "..", "logs", "accessLogs"),
      );
      const errorLogStream = createRotatingFileStream(
        "1d",
        7,
        path.join(__dirname, "..", "logs", "errorLogs"),
      );

      this._app.use(morgan("combined", { stream: accessLogStream }));
      this._app.use(
        morgan("combined", {
          stream: errorLogStream,
          skip: (req: Request, res: Response) => res.statusCode < 400,
        }),
      );
    }
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
