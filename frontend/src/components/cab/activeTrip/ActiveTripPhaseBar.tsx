import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import { type RideStatus, RIDE_STATUSES } from "@/types/rideStatus";

interface ActiveTripPhaseBarProps {
    phase: RideStatus;
    distanceMetres: number;
    eta: string;
    minToArrival: number;
}

const phaseConfig: Partial<
    Record<RideStatus, { labelKey: string; dotColor: string; pulse: boolean }>
> = {
    [RIDE_STATUSES.MATCHED]: {
        labelKey: translationKey.activeTrip.headingToPickup,
        dotColor: "bg-black",
        pulse: true,
    },
    [RIDE_STATUSES.ARRIVED]: {
        labelKey: translationKey.activeTrip.arrivedAtPickup,
        dotColor: "bg-green-500",
        pulse: true,
    },
    [RIDE_STATUSES.IN_TRANSIT]: {
        labelKey: translationKey.activeTrip.inTransit,
        dotColor: "bg-black",
        pulse: false,
    },
};

export function ActiveTripPhaseBar({
    phase,
    distanceMetres,
    eta,
    minToArrival,
}: ActiveTripPhaseBarProps) {
    const { t } = useTranslation();
    const config = phaseConfig[phase] ?? phaseConfig[RIDE_STATUSES.MATCHED]!;
    const distanceKm = (distanceMetres / 1000).toFixed(1);

    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3"
        >
            <div className="flex items-center gap-2 mb-1">
                <span className="relative flex h-2.5 w-2.5">
                    {config.pulse && (
                        <span
                            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-50 ${config.dotColor}`}
                        />
                    )}
                    <span
                        className={`relative inline-flex rounded-full h-2.5 w-2.5 ${config.dotColor}`}
                    />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    {t(config.labelKey)}
                </span>
            </div>

            <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-gray-900 tracking-tight">
                        {distanceKm} km
                    </span>
                    <span className="text-sm text-gray-500 font-medium">
                        {t(translationKey.activeTrip.minToArrival, {
                            min: minToArrival,
                        })}
                    </span>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        {t(translationKey.activeTrip.estArrival)}
                    </p>
                    <p className="text-xl font-black text-gray-900">{eta}</p>
                </div>
            </div>
        </motion.div>
    );
}
