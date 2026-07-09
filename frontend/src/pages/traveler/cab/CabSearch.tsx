import { useState, useEffect } from "react";
import { useLoaderData, useSearch, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { createRideMutationOptions } from "@/queryOptions/rideQueryOptions";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import translationKey from "@/utils/i18n/translationKey";
import { env } from "@/config/env";
import MapboxMap from "@/components/shared/MapboxMap";
import FareSummary from "@/components/traveler/cab/FareSummary";
import CabOptionList from "@/components/traveler/cab/CabOptionList";
import BookingAction from "@/components/traveler/cab/BookingAction";
import { calculateDistance } from "@/utils/distance";
import type { VehicleType } from "@/types/vehicleType";
import { getNearbyDrivers } from "@/services/api/cabApiService";
import type { INearbyDriver } from "@/types/api/responses/cabResponses";
import type { MapboxMarker } from "@/components/shared/MapboxMap";

const NEARBY_POLL_INTERVAL_MS = 3000;

const CabSearch = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const searchParams = useSearch({ from: "/traveler/cab/search" });
    const loaderData = useLoaderData({ from: "/traveler/cab/search" });
    const fareData = loaderData.data;

    const { mutate: createRide } = useMutation(createRideMutationOptions());

    const [selectedCab, setSelectedCab] = useState<VehicleType | null>(null);
    const [routeCoordinates, setRouteCoordinates] = useState<
        [number, number][]
    >([]);
    const [nearbyDrivers, setNearbyDrivers] = useState<INearbyDriver[]>([]);

    // Fetch route coordinates when search params change
    useEffect(() => {
        const fetchRoute = async () => {
            const { pickupLat, pickupLng, dropoffLat, dropoffLng } =
                searchParams;

            if (!pickupLat || !pickupLng || !dropoffLat || !dropoffLng) {
                setRouteCoordinates([]);
                return;
            }

            const distance = calculateDistance(
                pickupLat,
                pickupLng,
                dropoffLat,
                dropoffLng
            );

            if (distance > 100) {
                setRouteCoordinates([]);
                toast.error(t(translationKey.cabHome.maxDistanceExceeded));
                return;
            }

            try {
                const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupLng},${pickupLat};${dropoffLng},${dropoffLat}?overview=full&geometries=geojson&access_token=${env.VITE_MAPBOX_ACCESS_TOKEN}`;
                const res = await fetch(url);
                const data = await res.json();

                const coordinates = data.routes?.[0]?.geometry?.coordinates;
                if (coordinates && coordinates.length > 0) {
                    setRouteCoordinates(coordinates);
                } else {
                    setRouteCoordinates([]);
                    toast.error(t(translationKey.cabHome.noRouteFound));
                }
            } catch {
                console.error("Failed to fetch route");
                setRouteCoordinates([]);
            }
        };

        fetchRoute();
    }, [searchParams, t]);

    // Poll nearby drivers every 3 seconds centered on the pickup point
    useEffect(() => {
        const { pickupLat, pickupLng } = searchParams;
        if (!pickupLat || !pickupLng) return;

        const fetchNearby = async () => {
            try {
                const response = await getNearbyDrivers(pickupLat, pickupLng);
                if (response?.data) {
                    setNearbyDrivers(response.data);
                }
            } catch {
                // Non-critical — silently ignore errors so UX isn't disrupted
            }
        };

        fetchNearby(); // Immediate first fetch
        const interval = setInterval(fetchNearby, NEARBY_POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [searchParams.pickupLat, searchParams.pickupLng]);

    function handleStartSearch() {
        if (selectedCab && fareData) {
            createRide(
                {
                    fareId: fareData.id,
                    vehicleType: selectedCab,
                },
                {
                    onSuccess: (response) => {
                        if (!response.data?.rideId) return;
                        navigate({
                            to: `/traveler/cab/ride/${response.data.rideId}`,
                        });
                    },
                    onError: (error) => {
                        toast.error(error.message);
                    },
                }
            );
        }
    }

    // Static pickup/dropoff markers
    const baseMarkers: MapboxMarker[] = [
        {
            id: "pickup",
            lat: searchParams.pickupLat,
            lng: searchParams.pickupLng,
            label: "Pickup",
            color: "#000000",
        },
        {
            id: "dropoff",
            lat: searchParams.dropoffLat,
            lng: searchParams.dropoffLng,
            label: "Drop-off",
            color: "#111111",
        },
    ];

    // Nearby cab markers — skipBounds ensures the map camera never repositions on poll updates
    const cabMarkers: MapboxMarker[] = nearbyDrivers.map((driver) => ({
        id: `cab-${driver.driverId}`,
        lat: driver.coordinates.latitude,
        lng: driver.coordinates.longitude,
        vehicleType: driver.vehicleType,
        rotation: driver.heading ?? 0,
        label: driver.vehicleType,
        skipBounds: true,
    }));

    const markers: MapboxMarker[] = [...baseMarkers, ...cabMarkers];

    return (
        <div className="min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] bg-gray-50 text-black flex flex-col md:flex-row overflow-hidden font-sans">
            <div className="w-full md:w-[400px] lg:w-[450px] p-6 md:p-8 flex flex-col h-full bg-white z-10 custom-scrollbar overflow-y-auto shadow-[4px_0_24px_rgba(0,0,0,0.06)] relative border-r border-gray-100 flex-shrink-0">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight mb-4">
                        {t(translationKey.cabHome.searchResults) ||
                            "Choose a ride"}
                    </h1>

                    {fareData && (
                        <FareSummary
                            distance={fareData.distance}
                            time={fareData.time}
                        />
                    )}
                </div>

                {fareData && (
                    <CabOptionList
                        fares={fareData.fares}
                        selectedCab={selectedCab}
                        onSelect={setSelectedCab}
                    />
                )}

                <BookingAction
                    selectedCab={selectedCab}
                    onClick={handleStartSearch}
                />
            </div>

            <div className="w-full md:flex-1 h-[50vh] md:h-full relative order-first md:order-last bg-gray-100">
                <MapboxMap
                    markers={markers}
                    routeCoordinates={routeCoordinates}
                    className="h-full w-full !rounded-none"
                    initialZoom={12}
                />
            </div>
        </div>
    );
};

export default CabSearch;
