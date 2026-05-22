import { io, Socket } from "socket.io-client";
import { env } from "../../config/env";

class SocketService {
    private socket: Socket | null = null;
    private persistentListeners: Map<
        string,
        Set<(...args: unknown[]) => void>
    > = new Map();

    connect(token: string): void {
        if (this.socket) return;

        const socketUrl =
            env.VITE_SOCKET_URL || env.VITE_BASEURL || "http://localhost:5000";

        this.socket = io(socketUrl, {
            auth: { token },
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: 5,
        });

        this.persistentListeners.forEach((callbacks, event) => {
            callbacks.forEach((cb) =>
                this.socket?.on(event, cb as (...args: unknown[]) => void)
            );
        });

        this.socket.on("connect", () => {
            console.log("[SocketService] Connected:", this.socket?.id);
        });

        this.socket.on("connect_error", (err) => {
            console.error("[SocketService] Connection Error:", err.message);
        });

        this.socket.on("disconnect", (reason) => {
            console.log("[SocketService] Disconnected:", reason);
        });
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    onPersistent<T extends unknown[]>(
        event: string,
        cb: (...args: T) => void
    ): () => void {
        const callback = cb as (...args: unknown[]) => void;
        if (!this.persistentListeners.has(event)) {
            this.persistentListeners.set(event, new Set());
        }
        this.persistentListeners.get(event)?.add(callback);

        this.socket?.on(event, callback);

        return () => {
            this.persistentListeners.get(event)?.delete(callback);
            this.socket?.off(event, callback);
        };
    }

    on<T extends unknown[]>(event: string, cb: (...args: T) => void): void {
        this.socket?.on(event, cb as (...args: unknown[]) => void);
    }

    off<T extends unknown[]>(event: string, cb: (...args: T) => void): void {
        this.socket?.off(event, cb as (...args: unknown[]) => void);
    }

    emit(event: string, data?: unknown): void {
        if (this.socket?.connected) {
            this.socket.emit(event, data);
        } else {
            console.warn(
                `[SocketService] Cannot emit "${event}" — socket not connected.`
            );
        }
    }

    isConnected(): boolean {
        return this.socket?.connected || false;
    }
}

export const socketService = new SocketService();
