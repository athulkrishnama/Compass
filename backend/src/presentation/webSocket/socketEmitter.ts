import { ISocketEmitter } from "@application/interfaces/service/socketEmitter.interface";
import { Server } from "socket.io";
import { injectable } from "tsyringe";

@injectable()
export class SocketEmitter implements ISocketEmitter {
  private _io: Server | null = null;

  setServer(io: Server): void {
    this._io = io;
  }

  emitToUser(userId: string, event: string, data: unknown): void {
    if (!this._io) {
      console.warn(
        `[SocketEmitter] Cannot emit "${event}" — server not initialized.`,
      );
      return;
    }
    this._io.to(userId).emit(event, data);
  }

  emitToRoom(room: string, event: string, data: unknown): void {
    if (!this._io) {
      console.warn(
        `[SocketEmitter] Cannot emit "${event}" — server not initialized.`,
      );
      return;
    }
    this._io.to(room).emit(event, data);
  }
}
