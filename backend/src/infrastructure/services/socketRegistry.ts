import { inject, singleton } from "tsyringe";
import { Server } from "socket.io";
import { ICacheService } from "application/interfaces/service/cacheService.interface";
import { ISocketRegistry } from "application/interfaces/service/socketRegistry.interface";
import { SocketConstants } from "@presentation/constants/socketEvents";

@singleton()
export class SocketRegistry implements ISocketRegistry {
  private _io!: Server;

  constructor(@inject("ICacheService") private _cacheService: ICacheService) {}

  public init(io: Server): void {
    this._io = io;
    console.log("[SocketRegistry] Initialized with Socket.io server instance.");
  }

  public async getSocketId(userId: string): Promise<string | null> {
    const key = `${SocketConstants.USER_SOCKET_PREFIX}${userId}`;
    return await this._cacheService.getValue(key);
  }

  public async registerUser(userId: string, socketId: string): Promise<void> {
    const key = `${SocketConstants.USER_SOCKET_PREFIX}${userId}`;
    await this._cacheService.setValue(key, socketId);
    console.log(
      `[SocketRegistry] Registered user ${userId} with socket ${socketId}`,
    );
  }

  public async removeUser(userId: string): Promise<void> {
    const key = `${SocketConstants.USER_SOCKET_PREFIX}${userId}`;
    await this._cacheService.deleteValue(key);
    console.log(`[SocketRegistry] Removed user ${userId}`);
  }

  public async emitToUser(
    userId: string,
    event: string,
    payload: unknown,
  ): Promise<void> {
    if (!this._io) {
      console.warn(
        `[SocketRegistry] Socket.io not initialized, cannot emit ${event} to user ${userId}`,
      );
      return;
    }

    const socketId = await this.getSocketId(userId);
    if (socketId) {
      this._io.to(socketId).emit(event, payload);
    } else {
      console.log(
        `[SocketRegistry] No active socket found for user ${userId}, missed event ${event}`,
      );
    }
  }
}
