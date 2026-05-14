import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../../store/store";
import { socketService } from "../../services/socket/socketService";
import { SocketEvents } from "../../constants/socketEvents";
import {
    addNotification,
    type Notification,
} from "../../store/slices/notificationSlice";
import {
    updateRideStatus,
    setActiveRide,
} from "../../store/slices/activeRideSlice";
import { toast } from "sonner";
import { SocketContext } from "./SocketContext";

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const dispatch = useDispatch();
    const { isLoggedin } = useSelector((state: RootState) => state.user);
    const { accessToken } = useSelector((state: RootState) => state.token);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const cleanups: Array<() => void> = [];

        if (isLoggedin && accessToken) {
            socketService.connect(accessToken);
            setIsConnected(true);

            cleanups.push(
                socketService.onPersistent(
                    SocketEvents.NOTIFICATION_NEW,
                    (data: Notification) => {
                        console.log(
                            "[SocketProvider] Global Notification:",
                            data
                        );
                        dispatch(addNotification(data));
                        toast.info(data.title, {
                            description: data.message,
                        });
                    }
                )
            );

            cleanups.push(
                socketService.onPersistent(
                    SocketEvents.RIDE_DRIVER_ASSIGNED,
                    (data: { driver: unknown }) => {
                        console.log("[SocketProvider] Driver Assigned:", data);
                        dispatch(
                            setActiveRide({
                                status: "matched",
                                driver: data.driver,
                            })
                        );
                        toast.success("Driver Assigned!", {
                            description:
                                "A driver has been assigned to your ride.",
                        });
                    }
                )
            );

            cleanups.push(
                socketService.onPersistent(
                    SocketEvents.RIDE_CANCELLED,
                    (data: { message?: string }) => {
                        console.log("[SocketProvider] Ride Cancelled:", data);
                        dispatch(updateRideStatus("cancelled"));
                        toast.error("Ride Cancelled", {
                            description:
                                data.message || "Your ride has been cancelled.",
                        });
                    }
                )
            );

            cleanups.push(
                socketService.onPersistent(
                    SocketEvents.RIDE_NO_DRIVERS,
                    (data: unknown) => {
                        console.log("[SocketProvider] No Drivers:", data);
                        dispatch(updateRideStatus("cancelled"));
                        toast.error("No Drivers Found", {
                            description:
                                "We couldn't find a driver for your ride.",
                        });
                    }
                )
            );

            cleanups.push(
                socketService.onPersistent(
                    SocketEvents.RIDE_NEW_REQUEST,
                    (data: { ride_id: string }) => {
                        console.log("[SocketProvider] New Ride Request:", data);
                        toast.info("New Ride Request", {
                            description: "You have a new ride request nearby.",
                            duration: 30000,
                            action: {
                                label: "View",
                                onClick: () => {
                                    console.log("View request", data.ride_id);
                                },
                            },
                        });
                    }
                )
            );
        } else {
            socketService.disconnect();
            setIsConnected(false);
        }

        return () => {
            cleanups.forEach((cleanup) => cleanup());
        };
    }, [isLoggedin, accessToken, dispatch]);

    return (
        <SocketContext.Provider value={{ isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
