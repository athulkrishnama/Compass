import { env } from "@config/envConfig";
import morgan from "morgan";
import { Express, Request, Response } from "express";
import { createRotatingFileStream } from "@utils/rfs";
import path from "path";

export function setErrorHandlingMiddleware(app: Express) {
  if (env.NODE_ENV === "DEVELOPMENT") {
    app.use(morgan("combined"));
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

    app.use(morgan("combined", { stream: accessLogStream }));
    app.use(
      morgan("combined", {
        stream: errorLogStream,
        skip: (req: Request, res: Response) => res.statusCode < 400,
      }),
    );
  }
}
