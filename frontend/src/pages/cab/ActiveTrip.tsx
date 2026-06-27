import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { ActiveTripPhaseBar } from "@/components/cab/activeTrip/ActiveTripPhaseBar";
import { ActiveTripPanel } from "@/components/cab/activeTrip/ActiveTripPanel";
import { ActiveTripMapOverlay } from "@/components/cab/activeTrip/ActiveTripMapOverlay";
import { ActiveTripCancelModal } from "@/components/cab/activeTrip/ActiveTripCancelModal";
import { RIDE_STATUSES, type RideStatus } from "@/types/rideStatus";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys/queryKeys";
import { getActiveRideDetailsQueryOptions } from "@/queryOptions/rideQueryOptions";
import MapboxMap from "@/components/shared/MapboxMap";
import { useActiveTripMap } from "@/hooks/useActiveTripMap";
import { socketService } from "@/services/socket/socketService";
import { SocketEvents } from "@/constants/socketEvents";
import { useSocketEvent } from "@/hooks/useSocketEvent";
import Loading from "@/components/shared/loading/Loading";
import { NoActiveRide } from "@/components/cab/activeTrip/NoActiveRide";
import { ActiveTripCompletedOverlay } from "@/components/cab/activeTrip/ActiveTripCompletedOverlay";
import { ActiveTripRecordCashModal } from "@/components/cab/activeTrip/ActiveTripRecordCashModal";
import { toast } from "sonner";
import {
    DRIVER_EVENTS_TYPES,
    type DriverEventPayload,
} from "@/types/socketPayloads";
import { calculateDistance } from "@/utils/distance";
function calcEta(minutesFromNow: number): string {
    const d = new Date(Date.now() + minutesFromNow * 60 * 1000);
    return d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

const DEFAULT_COORDINATE = { latitude: 0, longitude: 0 };

export default function ActiveTripPage() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const {
        data: rideResponse,
        isLoading: isQueryLoading,
        error,
    } = useQuery(getActiveRideDetailsQueryOptions());
    const rideDetails = rideResponse?.data;

    const [phase, setPhase] = useState<RideStatus | null>(null);
    const [otpInput, setOtpInput] = useState("");
    const [cancelOpen, setCancelOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const prevRideIdRef = useRef<string | undefined>(undefined);

    // Initialize or reset phase when data is fetched or ride changes
    useEffect(() => {
        if (rideDetails) {
            if (!phase || prevRideIdRef.current !== rideDetails._id) {
                setPhase(rideDetails.status);
                prevRideIdRef.current = rideDetails._id;
            }
        }
    }, [rideDetails, phase]);

    const { driverCoordinate, routeCoordinates, markers, mapCenter } =
        useActiveTripMap({
            phase: phase ?? RIDE_STATUSES.MATCHED,
            pickupCoordinate: rideDetails?.pickup_point ?? DEFAULT_COORDINATE,
            dropoffCoordinate: rideDetails?.dropoff_point ?? DEFAULT_COORDINATE,
            rideId: rideDetails?._id,
        });

    const isActionDisabled = useMemo(() => {
        if (!rideDetails) return false;

        if (phase === RIDE_STATUSES.MATCHED) {
            if (!driverCoordinate) return true;
            const dist = calculateDistance(
                driverCoordinate.latitude,
                driverCoordinate.longitude,
                rideDetails.pickup_point.latitude,
                rideDetails.pickup_point.longitude
            );
            return dist > 0.5;
        }
        if (phase === RIDE_STATUSES.ARRIVED) {
            return otpInput.length < 4;
        }
        if (phase === RIDE_STATUSES.IN_TRANSIT) {
            if (!driverCoordinate) return true;
            const dist = calculateDistance(
                driverCoordinate.latitude,
                driverCoordinate.longitude,
                rideDetails.dropoff_point.latitude,
                rideDetails.dropoff_point.longitude
            );
            return dist > 0.5;
        }
        return false;
    }, [phase, driverCoordinate, rideDetails, otpInput]);

    useSocketEvent(
        SocketEvents.DRIVER_EVENTS,
        (data: DriverEventPayload) => {
            if (data.payload.ride_id !== rideDetails?._id) return;

            switch (data.type) {
                case DRIVER_EVENTS_TYPES.ARRIVED:
                    setPhase(RIDE_STATUSES.ARRIVED);
                    break;
                case DRIVER_EVENTS_TYPES.STARTED:
                    setIsLoading(false);
                    setPhase(RIDE_STATUSES.IN_TRANSIT);
                    break;
                case DRIVER_EVENTS_TYPES.COMPLETED:
                    setPhase(RIDE_STATUSES.COMPLETED);
                    break;
                case DRIVER_EVENTS_TYPES.PAYMENT_INITIATED:
                    queryClient.invalidateQueries({
                        queryKey: [QUERY_KEYS.ACTIVE_RIDE],
                    });
                    break;
                case DRIVER_EVENTS_TYPES.PAYMENT_RECEIVED:
                    queryClient.invalidateQueries({
                        queryKey: [QUERY_KEYS.ACTIVE_RIDE],
                    });
                    toast.success("Payment Received!");
                    break;
                case DRIVER_EVENTS_TYPES.CANCELLED:
                    setPhase(RIDE_STATUSES.CANCELLED);
                    break;
            }
        },
        !!rideDetails
    );

    if (isQueryLoading) {
        return (
            <div className="w-full h-[100dvh]">
                <Loading />
            </div>
        );
    }

    if (!rideDetails) {
        return <NoActiveRide />;
    }

    if (!phase) {
        return (
            <div className="w-full h-[100dvh]">
                <Loading />
            </div>
        );
    }

    if (
        error &&
        error.message !== "Ride not found" &&
        error.message !== "Internal Server Error"
    ) {
        // Note: Adjust based on exact backend message
        return (
            <div className="w-full h-[100dvh] flex items-center justify-center bg-gray-50 text-red-500 font-medium">
                {error.message || "Failed to load active ride details."}
            </div>
        );
    }

    const eta = calcEta(rideDetails.time);

    const handlePrimaryAction = () => {
        if (phase === RIDE_STATUSES.MATCHED) {
            socketService.emit(
                SocketEvents.DRIVER_ARRIVED,
                { ride_id: rideDetails._id },
                (res: { success: boolean; message?: string }) => {
                    if (!res.success) {
                        toast.error("Failed to arrive", {
                            description: res.message,
                        });
                    }
                }
            );
            return;
        }
        if (phase === RIDE_STATUSES.ARRIVED) {
            if (otpInput.length < 4) return;
            setIsLoading(true);
            socketService.emit(
                SocketEvents.DRIVER_VERIFY_OTP,
                { ride_id: rideDetails._id, otp: otpInput },
                (res: { success: boolean; message?: string }) => {
                    if (!res.success) {
                        setIsLoading(false);
                        toast.error("Invalid OTP", {
                            description: res.message,
                        });
                    }
                }
            );
            // State will be updated when DRIVER_EVENTS.STARTED is received
            return;
        }
        if (phase === RIDE_STATUSES.IN_TRANSIT) {
            socketService.emit(
                SocketEvents.DRIVER_RIDE_COMPLETED,
                { ride_id: rideDetails._id },
                (res: { success: boolean; message?: string }) => {
                    if (!res.success) {
                        toast.error("Failed to complete ride", {
                            description: res.message,
                        });
                    }
                }
            );
        }
    };

    const handleCancelConfirm = () => {
        socketService.emit(
            SocketEvents.DRIVER_CANCEL_RIDE,
            { ride_id: rideDetails._id },
            (res: { success: boolean; message?: string }) => {
                if (!res.success) {
                    toast.error("Failed to cancel ride", {
                        description: res.message,
                    });
                } else {
                    setCancelOpen(false);
                }
            }
        );
    };

    const handleOpenMaps = () => {
        let target = rideDetails.pickup_point;
        if (phase === RIDE_STATUSES.IN_TRANSIT) {
            target = rideDetails.dropoff_point;
        }
        const url = `https://www.google.com/maps/dir/?api=1&destination=${target.latitude},${target.longitude}`;
        window.open(url, "_blank");
    };

    const passenger = {
        name: rideDetails.rider.full_name,
        phone: rideDetails.rider.mobile ?? "",
        avatarUrl: rideDetails.rider.profile_image,
    };

    const sharedPanelProps = {
        phase,
        passenger,
        pickupCoordinate: rideDetails.pickup_point,
        dropoffCoordinate: rideDetails.dropoff_point,
        otpInput,
        onOtpInputChange: setOtpInput,
        onCancelRide: () => setCancelOpen(true),
        onPrimaryAction: handlePrimaryAction,
        isActionLoading: isLoading,
        isActionDisabled,
        onCall: () => {
            if (passenger.phone) {
                window.location.href = `tel:${passenger.phone}`;
            } else {
                toast.error("Phone number not available");
            }
        },
        onMessage: () => console.log("Message passenger"),
    };

    const sharedPhaseBarProps = {
        phase,
        distanceMetres: rideDetails.distance,
        eta,
        minToArrival: rideDetails.time,
        onOpenMaps: handleOpenMaps,
    };

    return (
        <div className="relative w-full h-[100dvh] bg-gray-50 overflow-hidden">
            {/* Background Map */}
            <div className="absolute inset-0 z-0">
                <MapboxMap
                    markers={markers}
                    routeCoordinates={routeCoordinates}
                    initialCenter={mapCenter}
                    initialZoom={13}
                    className="w-full h-full rounded-none"
                />
            </div>

            {/* Foreground UI Layer */}
            <div className="relative z-10 w-full h-full flex flex-col pointer-events-none">
                {/* Desktop top-right overlay */}
                <div className="w-full flex justify-end p-4 shrink-0">
                    <div className="hidden md:block pointer-events-auto">
                        <ActiveTripMapOverlay
                            distanceMetres={rideDetails.distance}
                            eta={eta}
                            onOpenMaps={handleOpenMaps}
                        />
                    </div>
                </div>

                {/* Desktop left-side panel */}
                {phase !== RIDE_STATUSES.COMPLETED && (
                    <div className="hidden md:flex absolute top-4 left-4 bottom-4 w-[360px] pointer-events-auto flex-col gap-4">
                        <ActiveTripPhaseBar {...sharedPhaseBarProps} />
                        <div className="flex-1">
                            <AnimatePresence mode="wait">
                                <ActiveTripPanel
                                    key={phase}
                                    {...sharedPanelProps}
                                />
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                {/* Spacer to push content to bottom */}
                <div className="flex-1 pointer-events-none" />

                {phase === RIDE_STATUSES.COMPLETED ? (
                    <div className="pointer-events-auto">
                        {rideDetails.paymentStatus === "SUCCESS" ? (
                            <ActiveTripCompletedOverlay
                                onAcknowledge={() => {
                                    setPhase(null);
                                    queryClient.invalidateQueries({
                                        queryKey: [QUERY_KEYS.ACTIVE_RIDE],
                                    });
                                    navigate({ to: "/cab/history" });
                                }}
                            />
                        ) : (
                            <div className="bg-white rounded-t-3xl shadow-2xl p-8 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                                <h2 className="text-xl font-bold text-gray-900">
                                    Waiting for Payment
                                </h2>
                                <p className="text-gray-500 mt-2">
                                    {rideDetails.paymentMethod === "CASH"
                                        ? "Please collect cash from the rider."
                                        : "Waiting for the rider to complete payment..."}
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="pointer-events-auto flex flex-col justify-end shrink-0 w-full">
                        <div className="md:hidden px-4 pt-4 pb-2 bg-transparent w-full">
                            <ActiveTripPhaseBar {...sharedPhaseBarProps} />
                        </div>

                        <div className="md:hidden w-full">
                            <AnimatePresence mode="wait">
                                <ActiveTripPanel
                                    key={phase}
                                    {...sharedPanelProps}
                                />
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </div>

            <ActiveTripCancelModal
                isOpen={cancelOpen}
                onClose={() => setCancelOpen(false)}
                onConfirm={handleCancelConfirm}
            />

            <ActiveTripRecordCashModal
                isOpen={
                    phase === RIDE_STATUSES.COMPLETED &&
                    rideDetails.paymentMethod === "CASH" &&
                    rideDetails.paymentStatus !== "SUCCESS"
                }
                tripId={rideDetails._id}
                expectedAmount={rideDetails.selected_fare?.fare ?? 0}
                onSuccess={() => {
                    navigate({ to: "/cab/history" });
                    queryClient.invalidateQueries({
                        queryKey: [QUERY_KEYS.ACTIVE_RIDE],
                    });
                }}
            />
        </div>
    );
}
