import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Clock, Calendar, IndianRupee, MapPin } from "lucide-react";
import { getDriverPastTripsQueryOptions } from "@/queryOptions/rideQueryOptions";
import Pagination from "@/components/shared/Pagination/Pagination";
import translationKey from "@/utils/i18n/translationKey";
import { useReverseGeocode } from "@/hooks/useReverseGeocode";
import type { IDriverPastTripResponseDTO } from "@/types/api/responses/rideResponses";

const TripCard = ({
    trip,
    index,
}: {
    trip: IDriverPastTripResponseDTO;
    index: number;
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { address: pickupAddress } = useReverseGeocode(trip.pickup_point);
    const { address: dropoffAddress } = useReverseGeocode(trip.dropoff_point);

    const isCancelled = trip.status === "cancelled";
    const durationMins = Math.ceil(trip.time / 60);

    const handleViewTrip = () => {
        navigate({ to: `/cab/ride/${trip._id}` });
    };

    return (
        <motion.div
            onClick={handleViewTrip}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex flex-col bg-white border border-black/10 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-black/20 transition-all gap-3 cursor-pointer"
        >
            {/* Header: Date, Duration, Fare */}
            <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500 gap-4">
                    <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {trip.date}
                    </span>
                    {!isCancelled && (
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {durationMins} min
                        </span>
                    )}
                    {isCancelled && (
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700 uppercase tracking-wider">
                            {t(translationKey.bookingStatus.CANCELLED)}
                        </span>
                    )}
                </div>
                <span className="flex items-center gap-1 font-semibold text-black">
                    <IndianRupee className="w-4 h-4" />
                    {trip.selected_fare.fare}
                </span>
            </div>

            {/* Distance badge */}
            {!isCancelled && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{(trip.distance / 1000).toFixed(1)} km</span>
                </div>
            )}

            {/* Route */}
            <div className="flex flex-col gap-2.5 relative">
                <div className="absolute left-[4px] top-[14px] bottom-[14px] w-0.5 bg-gray-200"></div>

                <div className="flex gap-3 relative">
                    <div className="w-2.5 h-2.5 rounded-full bg-black shrink-0 mt-1.5 z-10"></div>
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                            {t(translationKey.cabHome.pickup)}
                        </p>
                        <p className="text-sm font-medium text-black line-clamp-1">
                            {pickupAddress || "Loading..."}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 relative">
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-black bg-white shrink-0 mt-1.5 z-10"></div>
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                            {t(translationKey.cabHome.dropoff)}
                        </p>
                        <p className="text-sm font-medium text-black line-clamp-1">
                            {dropoffAddress || "Loading..."}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const DriverPastTrips = () => {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const limit = 6;

    const { data: pastTripsResponse, isLoading } = useQuery(
        getDriverPastTripsQueryOptions(page, limit)
    );

    const trips = pastTripsResponse?.data?.trips || [];
    const total = pastTripsResponse?.data?.total || 0;
    const totalPages = Math.ceil(total / limit);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-black tracking-tight mb-2">
                        {t(translationKey.driverHistory.title)}
                    </h1>
                    <p className="text-gray-500">
                        {t(translationKey.driverHistory.subtitle)}
                    </p>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="h-44 bg-white rounded-xl border border-black/10 animate-pulse"
                            ></div>
                        ))}
                    </div>
                ) : trips.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {trips.map((trip, index) => (
                                <TripCard
                                    key={trip._id}
                                    trip={trip}
                                    index={index}
                                />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                setPage={setPage}
                            />
                        )}
                    </>
                ) : (
                    <div className="bg-white border border-black/10 rounded-xl p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-black mb-2">
                            {t(translationKey.driverHistory.noTrips)}
                        </h3>
                        <p className="text-gray-500">
                            {t(translationKey.driverHistory.noTripsDescription)}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DriverPastTrips;
