import express, { Express, Request, Response } from "express";
import { env } from "./config/envConfig";
import { Errors } from "./infrastructure/validationSchemas/constants/Error";
import { Messages } from "./infrastructure/validationSchemas/constants/messages";
import morgan from "morgan";
import { createRotatingFileStream } from "./utils/rotatingFileStream";
import path from "path";
export class Server {
  private _app: Express;

  constructor() {
    this._app = express();
    this._setLoggingMiddleware();
    this._setMiddlewares();
  }

  private _setMiddlewares() {
    this._app.use(express.json());
    this._app.use(express.urlencoded());
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
