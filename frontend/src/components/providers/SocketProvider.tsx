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
import { openRideRequestPopup } from "../../store/slices/rideRequestPopupSlice";
import { toast } from "sonner";
import { SocketContext } from "./SocketContext";
import {
    DRIVER_EVENTS_TYPES,
    RIDER_EVENTS_TYPES,
    type DriverEventPayload,
    type RiderEventPayload,
} from "@/types/socketPayloads";

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
                    SocketEvents.RIDER_EVENTS,
                    (data: RiderEventPayload) => {
                        console.log("[SocketProvider] Rider Event:", data);
                        switch (data.type) {
                            case RIDER_EVENTS_TYPES.ASSIGNED:
                                dispatch(
                                    setActiveRide({
                                        status: "matched",
                                    })
                                );
                                toast.success("Driver Assigned!", {
                                    description:
                                        "A driver has been assigned to your ride.",
                                });
                                break;
                            case RIDER_EVENTS_TYPES.CANCELLED:
                                dispatch(updateRideStatus("cancelled"));
                                toast.error("Ride Cancelled", {
                                    description:
                                        (data.payload as { message?: string })
                                            .message ||
                                        "Your ride has been cancelled.",
                                });
                                break;
                            case RIDER_EVENTS_TYPES.NO_DRIVERS:
                                dispatch(updateRideStatus("cancelled"));
                                toast.error("No Drivers Found", {
                                    description:
                                        "We couldn't find a driver for your ride.",
                                });
                                break;
                            // Add other rider events (arrived, completed, etc.)
                        }
                    }
                )
            );

            cleanups.push(
                socketService.onPersistent(
                    SocketEvents.DRIVER_EVENTS,
                    (data: DriverEventPayload) => {
                        console.log("[SocketProvider] Driver Event:", data);
                        switch (data.type) {
                            case DRIVER_EVENTS_TYPES.REQUESTED: {
                                const payload = data.payload as {
                                    ride_id: string;
                                };
                                dispatch(openRideRequestPopup(payload.ride_id));
                                break;
                            }
                        }
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
