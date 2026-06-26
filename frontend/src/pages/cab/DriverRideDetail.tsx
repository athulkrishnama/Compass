import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
    ArrowLeft,
    Clock,
    MapPin,
    IndianRupee,
    Calendar,
    Car,
} from "lucide-react";
import { getRideDetailsQueryOptions } from "@/queryOptions/rideQueryOptions";
import MapboxMap from "@/components/shared/MapboxMap";
import { fetchRouteCoordinates } from "@/utils/mapbox";
import { useReverseGeocode } from "@/hooks/useReverseGeocode";
import translationKey from "@/utils/i18n/translationKey";
import { RIDE_STATUSES } from "@/types/rideStatus";

const DriverRideDetail = () => {
    const { t } = useTranslation();
    const { id } = useParams({ from: "/cab/ride/$id" });
    const navigate = useNavigate();

    const { data: rideResponse } = useQuery(getRideDetailsQueryOptions(id));
    const ride = rideResponse?.data;

    const [routeCoordinates, setRouteCoordinates] = useState<
        [number, number][]
    >([]);

    const { address: pickupAddress } = useReverseGeocode(ride?.pickup_point);
    const { address: dropoffAddress } = useReverseGeocode(ride?.dropoff_point);

    useEffect(() => {
        if (!ride) return;
        fetchRouteCoordinates(ride.pickup_point, ride.dropoff_point)
            .then((coords) => setRouteCoordinates(coords))
            .catch(() => console.error("Failed to fetch route"));
    }, [ride]);

    if (!ride) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50 text-gray-400 text-sm">
                {t(translationKey.rideDetails.rideDetailsNotAvailable)}
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
            color: "#555555",
        },
    ];

    const isCancelled = ride.status === RIDE_STATUSES.CANCELLED;
    const durationMins = Math.ceil(ride.time / 60);
    const distanceKm = (ride.distance / 1000).toFixed(1);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row pt-16">
            {/* Left panel */}
            <div className="w-full lg:w-[420px] xl:w-[460px] flex-shrink-0 overflow-y-auto bg-white border-r border-black/10 shadow-sm">
                <div className="p-6 md:p-8 space-y-6">
                    {/* Back button */}
                    <button
                        onClick={() => navigate({ to: "/cab/history" })}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t(translationKey.driverHistory.title)}
                    </button>

                    {/* Status badge */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-black">
                            {t(translationKey.activeTrip.tripDetails)}
                        </h1>
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                isCancelled
                                    ? "bg-red-100 text-red-700"
                                    : "bg-black text-white"
                            }`}
                        >
                            {ride.status}
                        </span>
                    </div>

                    <div className="h-px bg-black/10" />

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col items-center gap-1.5 bg-gray-50 rounded-xl p-3 border border-black/5">
                            <IndianRupee className="w-5 h-5 text-black" />
                            <span className="font-bold text-black text-sm">
                                ₹{ride.selected_fare.fare}
                            </span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                                Fare
                            </span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 bg-gray-50 rounded-xl p-3 border border-black/5">
                            <Car className="w-5 h-5 text-black" />
                            <span className="font-bold text-black text-sm">
                                {distanceKm} km
                            </span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                                Distance
                            </span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 bg-gray-50 rounded-xl p-3 border border-black/5">
                            <Clock className="w-5 h-5 text-black" />
                            <span className="font-bold text-black text-sm">
                                {durationMins} min
                            </span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                                Duration
                            </span>
                        </div>
                    </div>

                    <div className="h-px bg-black/10" />

                    {/* Route */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Route
                        </h3>
                        <div className="relative flex flex-col gap-5 pl-4">
                            <div className="absolute left-[7px] top-3 bottom-3 w-0.5 bg-gray-200"></div>

                            <div className="flex gap-3 relative">
                                <div className="w-3 h-3 rounded-full bg-black shrink-0 mt-1 z-10"></div>
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">
                                        {t(translationKey.activeTrip.pickup)}
                                    </p>
                                    <p className="text-sm font-medium text-black">
                                        {pickupAddress || "Loading..."}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 relative">
                                <div className="w-3 h-3 rounded-full border-2 border-black bg-white shrink-0 mt-1 z-10"></div>
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">
                                        {t(translationKey.activeTrip.dropoff)}
                                    </p>
                                    <p className="text-sm font-medium text-black">
                                        {dropoffAddress || "Loading..."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Status */}
                    {ride.paymentStatus && (
                        <>
                            <div className="h-px bg-black/10" />
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">
                                    Payment
                                </span>
                                <span
                                    className={`text-sm font-semibold ${
                                        ride.paymentStatus === "SUCCESS"
                                            ? "text-green-600"
                                            : "text-amber-600"
                                    }`}
                                >
                                    {ride.paymentStatus}
                                </span>
                            </div>
                        </>
                    )}

                    {/* Timeline */}
                    {ride.events && ride.events.length > 0 && (
                        <>
                            <div className="h-px bg-black/10" />
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {t(translationKey.rideDetails.timeline)}
                                </h3>
                                <div className="space-y-2">
                                    {ride.events.map((event, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between text-sm"
                                        >
                                            <span className="text-gray-600 capitalize">
                                                {event.event_name.replace(
                                                    /_/g,
                                                    " "
                                                )}
                                            </span>
                                            <span className="text-gray-400 text-xs">
                                                {new Date(
                                                    event.timestamp
                                                ).toLocaleTimeString("en-GB", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Map */}
            <div className="w-full lg:flex-1 h-[45vh] lg:h-auto relative order-first lg:order-last bg-gray-100">
                <MapboxMap
                    markers={markers}
                    routeCoordinates={routeCoordinates}
                    className="h-full w-full rounded-none"
                    initialZoom={12}
                />
            </div>
        </div>
    );
};

export default DriverRideDetail;
