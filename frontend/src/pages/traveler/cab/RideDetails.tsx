import { useState, useEffect } from "react";
import { useLoaderData, useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";
import MapboxMap from "@/components/shared/MapboxMap";
import RideHeader from "@/components/traveler/cab/ride/RideHeader";
import RideLocations from "@/components/traveler/cab/ride/RideLocations";
import TripStats from "@/components/traveler/cab/ride/TripStats";
import RideStatusSection from "@/components/traveler/cab/ride/RideStatusSection";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { setActiveRide } from "@/store/slices/activeRideSlice";
import { fetchRouteCoordinates } from "@/utils/mapbox";
import translationKey from "@/utils/i18n/translationKey";
import { useQuery } from "@tanstack/react-query";
import { getRideDetailsQueryOptions } from "@/queryOptions/rideQueryOptions";

const RideDetails = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { id } = useParams({ from: "/traveler/cab/ride/$id" });
    const loaderData = useLoaderData({ from: "/traveler/cab/ride/$id" });

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
        if (!ride) return;

        fetchRouteCoordinates(ride.pickup_point, ride.dropoff_point)
            .then((coords) => setRouteCoordinates(coords))
            .catch(() => console.error("Failed to fetch route"));
    }, [ride]);

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

    return (
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
    );
};

export default RideDetails;
