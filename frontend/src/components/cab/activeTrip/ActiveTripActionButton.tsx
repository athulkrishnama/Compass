import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import { type RideStatus, RIDE_STATUSES } from "@/types/rideStatus";

interface ActiveTripActionButtonProps {
    phase: RideStatus;
    isLoading?: boolean;
    disabled?: boolean;
    onClick: () => void;
}

const phaseButtonConfig: Partial<
    Record<RideStatus, { labelKey: string; style: string }>
> = {
    [RIDE_STATUSES.MATCHED]: {
        labelKey: translationKey.activeTrip.arrivedAtLocation,
        style: "bg-gray-900 hover:bg-gray-700 text-white",
    },
    [RIDE_STATUSES.ARRIVED]: {
        labelKey: translationKey.activeTrip.verifyOtp,
        style: "bg-gray-900 hover:bg-gray-700 text-white",
    },
    [RIDE_STATUSES.IN_TRANSIT]: {
        labelKey: translationKey.activeTrip.endTrip,
        style: "bg-red-600 hover:bg-red-500 text-white",
    },
};

export function ActiveTripActionButton({
    phase,
    isLoading,
    disabled,
    onClick,
}: ActiveTripActionButtonProps) {
    const { t } = useTranslation();
    const config =
        phaseButtonConfig[phase] ?? phaseButtonConfig[RIDE_STATUSES.MATCHED]!;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 pb-6 pt-2"
        >
            <button
                onClick={onClick}
                disabled={disabled || isLoading}
                className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${config.style}`}
            >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {t(config.labelKey)}
            </button>
        </motion.div>
    );
}
