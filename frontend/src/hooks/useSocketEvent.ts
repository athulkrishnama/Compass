import { useEffect, useRef } from "react";
import { socketService } from "../services/socket/socketService";

/**
 * Custom hook for component-scoped socket event listeners.
 * Auto-subscribes on mount and auto-unsubscribes on unmount.
 *
 * @param event The event name to listen for
 * @param handler The callback function when event is received
 * @param enabled Whether the listener should be active
 */
export function useSocketEvent<T = any>(
    event: string,
    handler: (data: T) => void,
    enabled: boolean = true
): void {
    const handlerRef = useRef(handler);
    handlerRef.current = handler;

    useEffect(() => {
        if (!enabled) return;

        const cb = (data: T) => {
            handlerRef.current(data);
        };

        socketService.on(event, cb);

        return () => {
            socketService.off(event, cb);
        };
    }, [event, enabled]);
}
