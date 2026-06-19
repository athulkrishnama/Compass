import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import type { Coordinate } from "@/types/coordinate";
import { useReverseGeocode } from "@/hooks/useReverseGeocode";

interface ActiveTripRouteOverviewProps {
    pickupCoordinate: Coordinate;
    dropoffCoordinate: Coordinate;
}

function AddressLine({ coordinate }: { coordinate: Coordinate }) {
    const { address, loading } = useReverseGeocode(coordinate);

    if (loading) {
        return (
            <div className="h-3.5 w-40 bg-gray-100 animate-pulse rounded mt-0.5" />
        );
    }

    return <p className="text-xs text-gray-400 mt-0.5 truncate">{address}</p>;
}

export function ActiveTripRouteOverview({
    pickupCoordinate,
    dropoffCoordinate,
}: ActiveTripRouteOverviewProps) {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4"
        >
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                {t(translationKey.activeTrip.routeOverview)}
            </p>

            <div className="flex gap-3">
                <div className="flex flex-col items-center pt-1 shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-900" />
                    <span className="w-px flex-1 bg-gray-200 my-1.5 min-h-[24px]" />
                    <span className="w-2.5 h-2.5 rounded-sm bg-gray-400" />
                </div>

                <div className="flex flex-col gap-4 flex-1 min-w-0">
                    <div>
                        <p className="font-semibold text-gray-900 text-sm leading-tight">
                            {t(translationKey.activeTrip.pickup)}
                        </p>
                        <AddressLine coordinate={pickupCoordinate} />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 text-sm leading-tight">
                            {t(translationKey.activeTrip.dropoff)}
                        </p>
                        <AddressLine coordinate={dropoffCoordinate} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
