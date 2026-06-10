import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { closeRideRequestPopup } from "@/store/slices/rideRequestPopupSlice";
import { useQuery } from "@tanstack/react-query";
import { getRideDetailsQueryOptions } from "@/queryOptions/rideQueryOptions";
import { Navigation } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { socketService } from "@/services/socket/socketService";
import { SocketEvents } from "@/constants/socketEvents";
import { useReverseGeocode } from "@/hooks/useReverseGeocode";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import { RideRequestHeader } from "./RideRequestHeader";
import { RideRequestLoading } from "./RideRequestLoading";
import { RideRequestRouteInfo } from "./RideRequestRouteInfo";
import { RideRequestStats } from "./RideRequestStats";
import { RideRequestActions } from "./RideRequestActions";
import MapboxMap from "@/components/shared/MapboxMap";
import { fetchRouteCoordinates } from "@/utils/mapbox";

export default function RideRequestPopup() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { isOpen, rideId } = useSelector(
        (state: RootState) => state.rideRequestPopup
    );
    const [timeLeft, setTimeLeft] = useState(10);
    const [routeCoordinates, setRouteCoordinates] = useState<
        [number, number][]
    >([]);

    const { data, isLoading, isError } = useQuery({
        ...getRideDetailsQueryOptions(rideId ?? ""),
        enabled: isOpen && !!rideId,
    });

    const handleDecline = () => {
        if (rideId) {
            socketService.emit(SocketEvents.DRIVER_REJECT_RIDE, {
                ride_id: rideId,
            });
        }
        dispatch(closeRideRequestPopup());
    };

    const handleAccept = () => {
        if (rideId) {
            socketService.emit(SocketEvents.DRIVER_ACCEPT_RIDE, {
                ride_id: rideId,
            });
        }
        dispatch(closeRideRequestPopup());
    };

    useEffect(() => {
        if (!isOpen) return;

        setTimeLeft(10);

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleDecline();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, rideId]);

    const pickupCoordinate = useMemo(() => {
        if (
            isOpen &&
            data?.data?.pickup_point?.latitude &&
            data?.data?.pickup_point?.longitude
        ) {
            return {
                latitude: data.data.pickup_point.latitude,
                longitude: data.data.pickup_point.longitude,
            };
        }
        return undefined;
    }, [
        isOpen,
        data?.data?.pickup_point?.latitude,
        data?.data?.pickup_point?.longitude,
    ]);

    const dropoffCoordinate = useMemo(() => {
        if (
            isOpen &&
            data?.data?.dropoff_point?.latitude &&
            data?.data?.dropoff_point?.longitude
        ) {
            return {
                latitude: data.data.dropoff_point.latitude,
                longitude: data.data.dropoff_point.longitude,
            };
        }
        return undefined;
    }, [
        isOpen,
        data?.data?.dropoff_point?.latitude,
        data?.data?.dropoff_point?.longitude,
    ]);

    useEffect(() => {
        if (!pickupCoordinate || !dropoffCoordinate) {
            setRouteCoordinates([]);
            return;
        }

        fetchRouteCoordinates(pickupCoordinate, dropoffCoordinate)
            .then((coords) => setRouteCoordinates(coords))
            .catch(() => console.error("Failed to fetch route"));
    }, [pickupCoordinate, dropoffCoordinate]);

    const mapMarkers = useMemo(() => {
        const list = [];
        if (pickupCoordinate) {
            list.push({
                id: "pickup",
                lat: pickupCoordinate.latitude,
                lng: pickupCoordinate.longitude,
                label: "Pickup",
                color: "#000000",
            });
        }
        if (dropoffCoordinate) {
            list.push({
                id: "dropoff",
                lat: dropoffCoordinate.latitude,
                lng: dropoffCoordinate.longitude,
                label: "Drop-off",
                color: "#444444",
            });
        }
        return list;
    }, [pickupCoordinate, dropoffCoordinate]);

    const { address: pickupAddress, loading: pickupAddressLoading } =
        useReverseGeocode(pickupCoordinate);
    const { address: dropoffAddress, loading: dropoffAddressLoading } =
        useReverseGeocode(dropoffCoordinate);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                <RideRequestHeader
                    timeLeft={timeLeft}
                    onDecline={handleDecline}
                />

                {isLoading && <RideRequestLoading />}

                {isError && (
                    <div className="px-5 pb-5 text-center text-red-500 text-sm">
                        {t(translationKey.rideRequestPopup.failedToLoadDetails)}
                    </div>
                )}

                {data && !isLoading && data.data && (
                    <>
                        <div className="mx-5 mb-4 rounded-2xl overflow-hidden h-36 sm:h-48 relative">
                            <MapboxMap
                                markers={mapMarkers}
                                routeCoordinates={routeCoordinates}
                                className="w-full h-full min-h-0"
                            />
                        </div>

                        <RideRequestRouteInfo
                            pickupAddress={pickupAddress}
                            pickupAddressLoading={pickupAddressLoading}
                            dropoffAddress={dropoffAddress}
                            dropoffAddressLoading={dropoffAddressLoading}
                        />

                        <RideRequestStats
                            time={data.data.time ?? 0}
                            fare={data.data.selected_fare?.fare ?? 0}
                        />

                        <div className="mx-5 mb-5 flex items-center gap-2 text-xs text-gray-400">
                            <Navigation className="w-3.5 h-3.5" />
                            <span>
                                {t(translationKey.rideRequestPopup.kmAway, {
                                    distance: data.data.distance
                                        ? (data.data.distance / 1000).toFixed(1)
                                        : "0.0",
                                })}
                            </span>
                        </div>

                        <RideRequestActions
                            onDecline={handleDecline}
                            onAccept={handleAccept}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
