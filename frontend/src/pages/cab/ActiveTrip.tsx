import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ActiveTripPhaseBar } from "@/components/cab/activeTrip/ActiveTripPhaseBar";
import { ActiveTripPanel } from "@/components/cab/activeTrip/ActiveTripPanel";
import { ActiveTripMapOverlay } from "@/components/cab/activeTrip/ActiveTripMapOverlay";
import { ActiveTripCancelModal } from "@/components/cab/activeTrip/ActiveTripCancelModal";
import { RIDE_STATUSES, type RideStatus } from "@/types/rideStatus";
import { useQuery } from "@tanstack/react-query";
import { getActiveRideDetailsQueryOptions } from "@/queryOptions/rideQueryOptions";
import MapboxMap from "@/components/shared/MapboxMap";
import { useActiveTripMap } from "@/hooks/useActiveTripMap";
function calcEta(minutesFromNow: number): string {
    const d = new Date(Date.now() + minutesFromNow * 60 * 1000);
    return d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

export default function ActiveTripPage() {
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

    // Initialize phase when data is fetched
    if (rideDetails && !phase) {
        setPhase(rideDetails.status);
    }

    const { routeCoordinates, markers, mapCenter } = useActiveTripMap({
        phase: phase ?? RIDE_STATUSES.MATCHED,
        pickupCoordinate: rideDetails?.pickup_point ?? {
            latitude: 0,
            longitude: 0,
        },
        dropoffCoordinate: rideDetails?.dropoff_point ?? {
            latitude: 0,
            longitude: 0,
        },
    });

    if (isQueryLoading || !rideDetails || !phase) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-gray-50">
                <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-gray-50 text-red-500 font-medium">
                Failed to load active ride details.
            </div>
        );
    }

    const eta = calcEta(rideDetails.time);

    const handlePrimaryAction = () => {
        if (phase === RIDE_STATUSES.MATCHED) {
            // TODO: emit DRIVER_ARRIVED socket event
            setPhase(RIDE_STATUSES.ARRIVED);
            return;
        }
        if (phase === RIDE_STATUSES.ARRIVED) {
            if (otpInput.length < 4) return;
            setIsLoading(true);
            // TODO: verify OTP via socket/API
            setTimeout(() => {
                setIsLoading(false);
                setPhase(RIDE_STATUSES.IN_TRANSIT);
            }, 800);
            return;
        }
        if (phase === RIDE_STATUSES.IN_TRANSIT) {
            // TODO: emit END_TRIP socket event
            console.log("End trip");
        }
    };

    const handleCancelConfirm = () => {
        // TODO: emit CANCEL_RIDE socket event
        setCancelOpen(false);
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
        onCall: () => console.log("Call passenger"),
        onMessage: () => console.log("Message passenger"),
    };

    const sharedPhaseBarProps = {
        phase,
        distanceMetres: rideDetails.distance,
        eta,
        minToArrival: rideDetails.time,
    };

    return (
        <div className="relative w-full h-screen flex flex-col bg-gray-50 overflow-hidden">
            <div className="flex-1 relative">
                <MapboxMap
                    markers={markers}
                    routeCoordinates={routeCoordinates}
                    initialCenter={mapCenter}
                    initialZoom={13}
                    className="absolute inset-0 h-full rounded-none"
                />

                <div className="hidden md:block">
                    <ActiveTripMapOverlay
                        distanceMetres={rideDetails.distance}
                        eta={eta}
                    />
                </div>
            </div>

            <div className="md:hidden px-4 pt-4 bg-white">
                <ActiveTripPhaseBar {...sharedPhaseBarProps} />
            </div>

            <div className="shrink-0 md:hidden">
                <AnimatePresence mode="wait">
                    <ActiveTripPanel key={phase} {...sharedPanelProps} />
                </AnimatePresence>
            </div>

            <div className="hidden md:flex absolute top-4 left-4 bottom-4 w-80 z-20 flex-col gap-3">
                <ActiveTripPhaseBar {...sharedPhaseBarProps} />
                <div className="flex-1 overflow-hidden">
                    <AnimatePresence mode="wait">
                        <ActiveTripPanel key={phase} {...sharedPanelProps} />
                    </AnimatePresence>
                </div>
            </div>

            <ActiveTripCancelModal
                isOpen={cancelOpen}
                onClose={() => setCancelOpen(false)}
                onConfirm={handleCancelConfirm}
            />
        </div>
    );
}
