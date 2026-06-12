import { useEffect, useRef } from "react";
import { socketService } from "../services/socket/socketService";

export function useSocketEvent<T>(
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
