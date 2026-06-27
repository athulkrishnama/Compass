import { useState, useEffect, useRef } from "react";
import { useLoaderData, useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";
import MapboxMap from "@/components/shared/MapboxMap";
import RideHeader from "@/components/traveler/cab/ride/RideHeader";
import RideLocations from "@/components/traveler/cab/ride/RideLocations";
import TripStats from "@/components/traveler/cab/ride/TripStats";
import RideStatusSection from "@/components/traveler/cab/ride/RideStatusSection";
import { ActiveTripOtpDisplay } from "@/components/cab/activeTrip/ActiveTripOtpDisplay";
import RideCabDetails from "@/components/cab/RideCabDetails";
import { RidePaymentModal } from "@/components/traveler/cab/ride/RidePaymentModal";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import {
    setActiveRide,
    updateRideStatus,
} from "@/store/slices/activeRideSlice";
import { fetchRouteCoordinates } from "@/utils/mapbox";
import translationKey from "@/utils/i18n/translationKey";
import { useQuery } from "@tanstack/react-query";
import { getRideDetailsQueryOptions } from "@/queryOptions/rideQueryOptions";
import { socketService } from "@/services/socket/socketService";
import { SocketEvents } from "@/constants/socketEvents";
import { RIDE_STATUSES, type RideStatus } from "@/types/rideStatus";
import { toast } from "sonner";
import {
    RIDER_EVENTS_TYPES,
    type RiderEventPayload,
} from "@/types/socketPayloads";
import { useSocketEvent } from "@/hooks/useSocketEvent";
import { PaymentStatus } from "@/enums/paymentStatus";

const CANCELLABLE_STATUSES: RideStatus[] = [
    RIDE_STATUSES.SEARCHING,
    RIDE_STATUSES.MATCHED,
];

const RideDetails = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { id } = useParams({ from: "/traveler/cab/ride/$id" });
    const loaderData = useLoaderData({ from: "/traveler/cab/ride/$id" });
    const [isCancelling, setIsCancelling] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    const [driverCoordinate, setDriverCoordinate] = useState<{
        lat: number;
        lng: number;
    } | null>(null);
    const [isDriverStale, setIsDriverStale] = useState(false);
    const staleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { data: rideQueryData } = useQuery({
        ...getRideDetailsQueryOptions(id),
        initialData: loaderData,
    });

    const ride = useAppSelector((state) => state.activeRide);

    const [routeCoordinates, setRouteCoordinates] = useState<
        [number, number][]
    >([]);

    useEffect(() => {
        if (rideQueryData?.data) {
            dispatch(setActiveRide(rideQueryData.data));
        }
    }, [rideQueryData, dispatch]);

    useEffect(() => {
        if (
            ride?.status === RIDE_STATUSES.COMPLETED &&
            (!ride.paymentStatus ||
                ride.paymentStatus === PaymentStatus.PENDING)
        ) {
            setIsPaymentOpen(true);
        }
    }, [ride?.status, ride?.paymentStatus]);

    useEffect(() => {
        if (!ride) return;

        let cancelled = false;
        const fetchRoute = async () => {
            let from = ride.pickup_point;
            let to = ride.dropoff_point;

            if (ride.status === RIDE_STATUSES.MATCHED) {
                from = driverCoordinate
                    ? {
                          latitude: driverCoordinate.lat,
                          longitude: driverCoordinate.lng,
                      }
                    : ride.pickup_point;
                to = ride.pickup_point;
            } else if (ride.status === RIDE_STATUSES.IN_TRANSIT) {
                from = driverCoordinate
                    ? {
                          latitude: driverCoordinate.lat,
                          longitude: driverCoordinate.lng,
                      }
                    : ride.pickup_point;
                to = ride.dropoff_point;
            }

            if (
                from.latitude === to.latitude &&
                from.longitude === to.longitude
            ) {
                if (!cancelled) setRouteCoordinates([]);
                return;
            }

            try {
                const coords = await fetchRouteCoordinates(from, to);
                if (!cancelled) setRouteCoordinates(coords);
            } catch {
                console.error("Failed to fetch route");
            }
        };

        fetchRoute();
        return () => {
            cancelled = true;
        };
    }, [ride, driverCoordinate]);

    useEffect(() => {
        if (!ride?._id) return;
        socketService.emit(SocketEvents.JOIN_RIDE_ROOM, { ride_id: ride._id });

        return () => {
            socketService.emit(SocketEvents.LEAVE_RIDE_ROOM, {
                ride_id: ride._id,
            });
        };
    }, [ride?._id]);

    useEffect(() => {
        return () => {
            if (staleTimeoutRef.current) clearTimeout(staleTimeoutRef.current);
        };
    }, []);

    useSocketEvent<{ latitude: number; longitude: number }>(
        SocketEvents.DRIVER_LOCATION_BROADCAST,
        (data) => {
            setDriverCoordinate({ lat: data.latitude, lng: data.longitude });
            setIsDriverStale(false);

            if (staleTimeoutRef.current) {
                clearTimeout(staleTimeoutRef.current);
            }
            staleTimeoutRef.current = setTimeout(() => {
                setIsDriverStale(true);
            }, 15000); // 15 seconds timeout
        },
        !!ride
    );

    useSocketEvent<RiderEventPayload>(
        SocketEvents.RIDER_EVENTS,
        (data) => {
            if (data.type === RIDER_EVENTS_TYPES.COMPLETED) {
                dispatch(updateRideStatus(RIDE_STATUSES.COMPLETED));
                toast.success("Ride completed!", {
                    description: "Please proceed to payment.",
                });
                setIsPaymentOpen(true);
            } else if (data.type === RIDER_EVENTS_TYPES.PAYMENT_SUCCESS) {
                setIsPaymentOpen(false);
                toast.success("Payment Successful!", {
                    description: "Thank you for riding with us.",
                });
            }
        },
        !!ride
    );

    const handleCancelRide = () => {
        if (!ride || isCancelling) return;
        setIsCancelling(true);
        socketService.emit(SocketEvents.RIDER_CANCEL_RIDE, {
            ride_id: ride._id,
        });
        toast.info("Cancellation requested", {
            description: "Your ride is being cancelled…",
        });
        setTimeout(() => setIsCancelling(false), 3000);
    };

    if (!ride) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-80px)] bg-neutral-50">
                <p className="text-neutral-500 text-sm">
                    {t(translationKey.rideDetails.rideDetailsNotAvailable)}
                </p>
            </div>
        );
    }

    const markers = [
        {
            id: "pickup",
            lat: ride.pickup_point.latitude,
            lng: ride.pickup_point.longitude,
            label: "Pickup",
            color: "#000000",
        },
        {
            id: "dropoff",
            lat: ride.dropoff_point.latitude,
            lng: ride.dropoff_point.longitude,
            label: "Drop-off",
            color: "#444444",
        },
    ];

    if (
        driverCoordinate &&
        (
            [
                RIDE_STATUSES.MATCHED,
                RIDE_STATUSES.ARRIVED,
                RIDE_STATUSES.IN_TRANSIT,
            ] as string[]
        ).includes(ride.status)
    ) {
        markers.push({
            id: "driver",
            lat: driverCoordinate.lat,
            lng: driverCoordinate.lng,
            label: isDriverStale ? "Cab (Updating...)" : "Cab",
            color: isDriverStale ? "#9ca3af" : "#3b82f6",
        });
    }

    return (
        <>
            <div className="min-h-[calc(100vh-80px)] bg-neutral-50 text-black flex flex-col lg:flex-row overflow-hidden font-sans">
                <div className="w-full lg:w-[420px] xl:w-[460px] flex-shrink-0 overflow-y-auto bg-white border-r border-neutral-100 shadow-[4px_0_24px_rgba(0,0,0,0.04)]">
                    <div className="p-6 md:p-8 space-y-6">
                        <RideHeader ride={ride} />
                        <Separator className="bg-neutral-100" />
                        <RideLocations
                            pickup={ride.pickup_point}
                            dropoff={ride.dropoff_point}
                        />
                        <Separator className="bg-neutral-100" />
                        <TripStats
                            distance={ride.distance}
                            time={ride.time}
                            selectedFare={ride.selected_fare}
                        />
                        <Separator className="bg-neutral-100" />
                        <RideStatusSection status={ride.status} />

                        {(
                            [
                                RIDE_STATUSES.MATCHED,
                                RIDE_STATUSES.ARRIVED,
                                RIDE_STATUSES.IN_TRANSIT,
                                RIDE_STATUSES.COMPLETED,
                            ] as string[]
                        ).includes(ride.status) && (
                            <RideCabDetails rideId={ride._id} />
                        )}

                        {ride.status === RIDE_STATUSES.ARRIVED && ride.otp && (
                            <ActiveTripOtpDisplay otp={ride.otp} />
                        )}

                        {CANCELLABLE_STATUSES.includes(ride.status) && (
                            <button
                                onClick={handleCancelRide}
                                disabled={isCancelling}
                                className="w-full mt-2 py-3 px-4 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isCancelling ? "Cancelling…" : "Cancel Ride"}
                            </button>
                        )}

                        {ride.status === RIDE_STATUSES.COMPLETED &&
                            (!ride.paymentStatus ||
                                ride.paymentStatus ===
                                    PaymentStatus.PENDING) && (
                                <button
                                    onClick={() => setIsPaymentOpen(true)}
                                    className="w-full mt-2 py-3 px-4 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all"
                                >
                                    Pay Fare
                                </button>
                            )}
                    </div>
                </div>

                <div className="w-full lg:flex-1 h-[45vh] lg:h-auto relative order-first lg:order-last bg-neutral-100">
                    <MapboxMap
                        markers={markers}
                        routeCoordinates={routeCoordinates}
                        className="h-full w-full rounded-none"
                        initialZoom={12}
                    />
                </div>
            </div>

            <RidePaymentModal
                isOpen={isPaymentOpen}
                tripId={ride._id}
                fareAmount={ride.selected_fare?.fare ?? 0}
                onSuccess={() => {
                    dispatch(
                        setActiveRide({
                            ...ride,
                            paymentStatus: PaymentStatus.SUCCESS,
                        })
                    );
                }}
                onClose={() => setIsPaymentOpen(false)}
            />
        </>
    );
};

export default RideDetails;
