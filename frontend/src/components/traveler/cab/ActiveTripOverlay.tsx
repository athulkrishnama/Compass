import { useQuery } from "@tanstack/react-query";
import { getRiderActiveRideQueryOptions } from "@/queryOptions/rideQueryOptions";
import { Link, useLocation } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, Navigation } from "lucide-react";
import { RIDE_STATUSES } from "@/types/rideStatus";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

export function ActiveTripOverlay() {
    const location = useLocation();
    const { t } = useTranslation();

    const { data: rideResponse } = useQuery(getRiderActiveRideQueryOptions());

    const ride = rideResponse?.data;

    if (!ride || location.pathname.startsWith("/traveler/cab/ride/")) {
        return null;
    }

    const formatStatus = (status: string) => {
        switch (status) {
            case RIDE_STATUSES.SEARCHING:
                return "Finding Driver";
            case RIDE_STATUSES.MATCHED:
                return "Driver Matched";
            case RIDE_STATUSES.ARRIVED:
                return "Driver Arrived";
            case RIDE_STATUSES.IN_TRANSIT:
                return "In Transit";
            case RIDE_STATUSES.COMPLETED:
                return "Payment Pending";
            default:
                return status;
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50 w-[calc(100%-2rem)] md:w-96"
            >
                <Link
                    to="/traveler/cab/ride/$id"
                    params={{ id: ride._id }}
                    className="block bg-white text-black p-4 rounded-2xl shadow-xl border border-gray-200 hover:scale-[1.02] transition-transform"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="bg-black/5 p-2 rounded-full">
                                <Navigation className="w-5 h-5 text-black" />
                            </div>
                            <span className="font-semibold text-sm">
                                {formatStatus(ride.status)}
                            </span>
                        </div>
                        {ride.status !== RIDE_STATUSES.COMPLETED && (
                            <div className="flex items-center gap-1 text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-medium">
                                <Clock className="w-4 h-4" />
                                <span>{ride.time} min</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                            {t(translationKey.activeTrip.clickToViewDetails)}
                        </span>
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>
                                {t(translationKey.activeTrip.kmTrip, {
                                    distance: (ride.distance / 1000).toFixed(1),
                                })}
                            </span>
                        </div>
                    </div>
                </Link>
            </motion.div>
        </AnimatePresence>
    );
}
