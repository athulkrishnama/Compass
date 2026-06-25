import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { store, type RootState } from "../../store/store";
import { socketService } from "../../services/socket/socketService";
import { SocketEvents } from "../../constants/socketEvents";
import {
    addNotification,
    type Notification,
} from "../../store/slices/notificationSlice";
import { updateRideStatus } from "../../store/slices/activeRideSlice";
import { openRideRequestPopup } from "../../store/slices/rideRequestPopupSlice";
import { toast } from "sonner";
import { SocketContext } from "./SocketContext";
import {
    DRIVER_EVENTS_TYPES,
    RIDER_EVENTS_TYPES,
    type DriverEventPayload,
    type RiderEventPayload,
} from "@/types/socketPayloads";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import { RIDE_STATUSES } from "@/types/rideStatus";
import { queryClient } from "@/config/tanstackQueryConfig";
import { QUERY_KEYS } from "@/constants/queryKeys/queryKeys";
import { router } from "@/main";

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const dispatch = useDispatch();
    const { isLoggedin } = useSelector((state: RootState) => state.user);
    const { accessToken } = useSelector((state: RootState) => state.token);
    const [isConnected, setIsConnected] = useState(false);
    const { t } = useTranslation();

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
                                    updateRideStatus(RIDE_STATUSES.MATCHED)
                                );
                                toast.success(
                                    t(translationKey.toasts.driverAssigned),
                                    {
                                        description: t(
                                            translationKey.toasts
                                                .driverAssignedDesc
                                        ),
                                    }
                                );
                                break;
                            case RIDER_EVENTS_TYPES.CANCELLED:
                                dispatch(
                                    updateRideStatus(RIDE_STATUSES.CANCELLED)
                                );
                                queryClient.invalidateQueries({
                                    queryKey: [
                                        QUERY_KEYS.RIDE_DETAILS,
                                        store.getState().activeRide?._id,
                                    ],
                                });
                                toast.error(
                                    t(translationKey.toasts.rideCancelled),
                                    {
                                        description:
                                            (
                                                data.payload as {
                                                    message?: string;
                                                }
                                            ).message ||
                                            t(
                                                translationKey.toasts
                                                    .rideCancelledDesc
                                            ),
                                    }
                                );
                                break;
                            case RIDER_EVENTS_TYPES.NO_DRIVERS:
                                dispatch(
                                    updateRideStatus(RIDE_STATUSES.CANCELLED)
                                );
                                queryClient.invalidateQueries({
                                    queryKey: [
                                        QUERY_KEYS.RIDE_DETAILS,
                                        store.getState().activeRide?._id,
                                    ],
                                });
                                toast.error(
                                    t(translationKey.toasts.noDrivers),
                                    {
                                        description: t(
                                            translationKey.toasts.noDriversDesc
                                        ),
                                    }
                                );
                                break;
                            case RIDER_EVENTS_TYPES.ARRIVED:
                                dispatch(
                                    updateRideStatus(RIDE_STATUSES.ARRIVED)
                                );
                                queryClient.invalidateQueries({
                                    queryKey: [
                                        QUERY_KEYS.RIDE_DETAILS,
                                        store.getState().activeRide?._id,
                                    ],
                                });
                                toast.success(
                                    t(
                                        translationKey.activeTrip
                                            .arrivedAtPickup,
                                        "Driver arrived at pickup location"
                                    )
                                );
                                break;
                            case RIDER_EVENTS_TYPES.STARTED:
                                dispatch(
                                    updateRideStatus(RIDE_STATUSES.IN_TRANSIT)
                                );
                                queryClient.invalidateQueries({
                                    queryKey: [
                                        QUERY_KEYS.RIDE_DETAILS,
                                        store.getState().activeRide?._id,
                                    ],
                                });
                                toast.success(
                                    t(
                                        translationKey.activeTrip.inTransit,
                                        "Ride started"
                                    )
                                );
                                break;
                            case RIDER_EVENTS_TYPES.COMPLETED:
                                dispatch(
                                    updateRideStatus(RIDE_STATUSES.COMPLETED)
                                );
                                queryClient.invalidateQueries({
                                    queryKey: [
                                        QUERY_KEYS.RIDE_DETAILS,
                                        store.getState().activeRide?._id,
                                    ],
                                });
                                toast.success(
                                    t(
                                        translationKey.bookingStatus.COMPLETED,
                                        "Ride completed"
                                    )
                                );
                                break;
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
                                dispatch(
                                    openRideRequestPopup({
                                        rideId: data.payload.ride_id,
                                        attempt_id: data.payload.attempt_id,
                                    })
                                );
                                break;
                            }
                            case DRIVER_EVENTS_TYPES.ACCEPTED: {
                                const currentPath =
                                    router.state.location.pathname;
                                if (currentPath !== "/cab/activeTrip") {
                                    router.navigate({ to: "/cab/activeTrip" });
                                }
                                break;
                            }
                            case DRIVER_EVENTS_TYPES.CANCELLED: {
                                toast.error("Ride Cancelled", {
                                    description:
                                        "The rider has cancelled the trip.",
                                });
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
    }, [isLoggedin, accessToken, dispatch, t]);

    return (
        <SocketContext.Provider value={{ isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
