import { Server } from "socket.io";

export interface ISocketRegistry {
  init(io: Server): void;
  getSocketId(userId: string): Promise<string | null>;
  registerUser(userId: string, socketId: string): Promise<void>;
  removeUser(userId: string): Promise<void>;
  emitToUser(userId: string, event: string, payload: unknown): Promise<void>;
}
