import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { LOCATION_EVENTS } from "@presentation/constants/events/locationEvents";
import { instrument } from "@socket.io/admin-ui";
import { env } from "@config/envConfig";
import { locationEventHandler, socketAuth } from "@infrastructure/DI/resolve";
import { Messages } from "../constants/messages";
import {
  InvalideDataException,
  TokenMissingException,
} from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";

export class SocketServer {
  private _io: Server;

  constructor(httpServer: HttpServer) {
    this._io = new Server(httpServer, {
      cors: {
        origin: [env.ORIGIN_URL, env.SOCKET_UI_ORIGIN, "http://localhost:5500"],
        credentials: true,
      },
    });
    this._start();
    instrument(this._io, {
      auth: {
        type: "basic",
        username: env.SOCKET_ADMIN_USERNAME,
        password: env.SOCKET_ADMIN_PASSWORD,
      },
    });
  }

  private _start() {
    console.log(Messages.SOCKET_SERVER_STARTED);
    this._io.on("connection", async (socket: Socket) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          throw new TokenMissingException(
            INTERNAL_ERROR_MESSAGES.TOKEN_DATA_MISSING,
          );
        }
        const decodedToken = await socketAuth.authenticate(token);
        if (!decodedToken) {
          throw new InvalideDataException(
            INTERNAL_ERROR_MESSAGES.INVALID_TOKEN_ERROR,
          );
        }
        socket.handshake.auth.userId = decodedToken.id;

        socket.on("disconnect", () => {
          console.log("User disconnected");
        });

        socket.on(LOCATION_EVENTS.LOCATION_UPDATE, (data) => {
          locationEventHandler.handleLocationUpdate({
            ...data,
            user_id: socket.handshake.auth.userId,
          });
        });
      } catch {
        socket.disconnect();
      }
    });
  }
}
