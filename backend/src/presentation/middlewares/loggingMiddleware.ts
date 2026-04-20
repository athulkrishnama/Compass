import { env } from "@config/envConfig";
import { Express } from "express";
import { createRotatingFileStream } from "presentation/utils/rfs";
import path from "path";
import { pinoHttp } from "pino-http";

export function setErrorHandlingMiddleware(app: Express) {
  if (env.NODE_ENV === "DEVELOPMENT") {
    app.use(
      pinoHttp({
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
            singleLine: false,
          },
        },
        serializers: {
          req(req) {
            return {
              method: req.method,
              url: req.url,
              ip: req.ip,
            };
          },
          res(res) {
            return {
              statusCode: res.statusCode,
            };
          },
        },
      }),
    );
  } else {
    const accessLogStream = createRotatingFileStream(
      "1d",
      7,
      path.join(process.cwd(), "logs", "accessLogs"),
    );
    const errorLogStream = createRotatingFileStream(
      "1d",
      7,
      path.join(process.cwd(), "logs", "errorLogs"),
    );

    const requestLogger = pinoHttp({
      customLogLevel(req, res, err) {
        if (res.statusCode >= 500 || err) return "error";
        if (res.statusCode >= 400) return "warn";
        return "info";
      },

      customSuccessMessage(req) {
        return `${req.method} ${req.url} completed`;
      },

      customErrorMessage(req) {
        return `${req.method} ${req.url} failed`;
      },

      autoLogging: true,

      serializers: {
        req(req) {
          return {
            method: req.method,
            url: req.url,
            ip: req.ip,
          };
        },
        res(res) {
          return {
            statusCode: res.statusCode,
          };
        },
      },
      stream: {
        write(msg: string) {
          accessLogStream.write(msg);

          const parsed = JSON.parse(msg);
          if (parsed.res?.statusCode >= 400) {
            errorLogStream.write(msg);
          }
        },
      },
    });

    app.use(requestLogger);
  }
}
