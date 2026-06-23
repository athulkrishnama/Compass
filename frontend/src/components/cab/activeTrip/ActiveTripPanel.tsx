import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import { type RideStatus, RIDE_STATUSES } from "@/types/rideStatus";
import type { Coordinate } from "@/types/coordinate";
import { ActiveTripPassengerCard } from "./ActiveTripPassengerCard";
import { ActiveTripRouteOverview } from "./ActiveTripRouteOverview";
import { ActiveTripOtpInput } from "./ActiveTripOtpInput";
import { ActiveTripActionButton } from "./ActiveTripActionButton";

interface ActiveTripPanelProps {
    phase: RideStatus;
    passenger: {
        name: string;
        phone: string;
        avatarUrl?: string;
    };
    pickupCoordinate: Coordinate;
    dropoffCoordinate: Coordinate;
    otpInput: string;
    onOtpInputChange: (v: string) => void;
    onCancelRide: () => void;
    onPrimaryAction: () => void;
    onCall?: () => void;
    onMessage?: () => void;
    isActionLoading?: boolean;
    isActionDisabled?: boolean;
}

export function ActiveTripPanel({
    phase,
    passenger,
    pickupCoordinate,
    dropoffCoordinate,
    otpInput,
    onOtpInputChange,
    onCancelRide,
    onPrimaryAction,
    onCall,
    onMessage,
    isActionLoading,
    isActionDisabled,
}: ActiveTripPanelProps) {
    const { t } = useTranslation();

    return (
        <motion.div
            key={phase}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="bg-white rounded-t-3xl shadow-2xl max-h-[65vh] overflow-y-auto hide-scroll-bar flex flex-col relative w-full"
        >
            <div className="flex justify-center pt-3 pb-1 shrink-0 sticky top-0 bg-white z-20">
                <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            <div className="px-4 pb-2 shrink-0">
                <h2 className="text-xl font-black text-gray-900 mb-3 mt-1">
                    {t(translationKey.activeTrip.tripDetails)}
                </h2>

                <ActiveTripPassengerCard
                    name={passenger.name}
                    phone={passenger.phone}
                    avatarUrl={passenger.avatarUrl}
                    onCall={onCall}
                    onMessage={onMessage}
                />

                {phase === RIDE_STATUSES.ARRIVED && (
                    <ActiveTripOtpInput
                        value={otpInput}
                        onChange={onOtpInputChange}
                    />
                )}

                <ActiveTripRouteOverview
                    pickupCoordinate={pickupCoordinate}
                    dropoffCoordinate={dropoffCoordinate}
                />

                {phase !== RIDE_STATUSES.IN_TRANSIT && (
                    <button
                        onClick={onCancelRide}
                        className="w-full py-4 text-sm text-gray-400 hover:text-red-500 font-medium transition-colors"
                    >
                        {t(translationKey.activeTrip.cancelRide)}
                    </button>
                )}
            </div>

            <div
                className="shrink-0 sticky bottom-0 bg-white pt-2 px-4 z-20 border-t border-gray-50"
                style={{
                    paddingBottom:
                        "calc(1rem + env(safe-area-inset-bottom, 0px))",
                }}
            >
                <ActiveTripActionButton
                    phase={phase}
                    onClick={onPrimaryAction}
                    isLoading={isActionLoading}
                    disabled={isActionDisabled}
                />
            </div>
        </motion.div>
    );
}
