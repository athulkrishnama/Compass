import { createContext, useContext } from "react";

export interface SocketContextType {
    isConnected: boolean;
}

export const SocketContext = createContext<SocketContextType>({
    isConnected: false,
});

export const useSocket = () => useContext(SocketContext);
