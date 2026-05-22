import { env } from "@config/envConfig";
import { Express } from "express";
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
            singleLine: true,
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
      transport: {
        targets: [
          {
            target: "pino-roll",
            options: {
              file: path.join(
                process.cwd(),
                "logs",
                "accessLogs",
                "access.log",
              ),
              frequency: "daily",
              mkdir: true,
              size: "10m",
            },
            level: "info",
          },
          {
            target: "pino-roll",
            options: {
              file: path.join(process.cwd(), "logs", "errorLogs", "error.log"),
              frequency: "daily",
              mkdir: true,
              size: "10m",
            },
            level: "warn",
          },
        ],
      },
    });

    app.use(requestLogger);
  }
}
