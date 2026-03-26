import { Server, Socket } from "socket.io";
import { ISocketRegistry } from "@application/interfaces/service/socketRegistry.interface";
import { SocketEvents } from "@presentation/constants/socketEvents";

export const setupSocketHandlers = (
  io: Server,
  socketRegistry: ISocketRegistry,
) => {
  io.on("connection", (socket: Socket) => {
    console.log(`[SocketHandlers] New connection: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`[SocketHandlers] Disconnected: ${socket.id}`);
    });

    socket.on(SocketEvents.USER_CONNECT, (data: { userId: string }) => {
      if (data && data.userId) {
        socketRegistry
          .registerUser(data.userId, socket.id)
          .catch(console.error);
      }
    });

    socket.on(SocketEvents.USER_DISCONNECT, (data: { userId: string }) => {
      if (data && data.userId) {
        socketRegistry.removeUser(data.userId).catch(console.error);
      }
    });
  });
};
