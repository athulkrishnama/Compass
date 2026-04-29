import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import CabHomeHeader from "@/components/traveler/cab/CabHomeHeader";
import LocationCard from "@/components/traveler/cab/LocationCard";
import PastTripsList from "@/components/traveler/cab/PastTripsList";
import MapboxMap, { type MapboxMarker } from "@/components/shared/MapboxMap";
import { type PastTrip } from "@/components/traveler/cab/PastTripCard";
import { calculateDistance } from "@/utils/distance";
import translationKey from "@/utils/i18n/translationKey";
import { env } from "@/config/env";

const PAST_TRIPS: PastTrip[] = [
    {
        id: "1",
        pickup: "Cochin International Airport, Nedumbassery",
        dropoff: "Marine Drive, Ernakulam",
        price: "₹480",
        duration: "42 min",
        date: "24 Mar 2026",
        pickupLat: 10.1535,
        pickupLng: 76.3913,
        dropoffLat: 9.9658,
        dropoffLng: 76.2812,
    },
    {
        id: "2",
        pickup: "Lulu Mall, Edapally",
        dropoff: "Fort Kochi, Kochi",
        price: "₹310",
        duration: "31 min",
        date: "21 Mar 2026",
        pickupLat: 10.017,
        pickupLng: 76.306,
        dropoffLat: 9.964,
        dropoffLng: 76.241,
    },
    {
        id: "3",
        pickup: "Ernakulam Junction Railway Station",
        dropoff: "Aluva Metro Station",
        price: "₹195",
        duration: "22 min",
        date: "18 Mar 2026",
        pickupLat: 9.9889,
        pickupLng: 76.2906,
        dropoffLat: 10.1004,
        dropoffLng: 76.3527,
    },
];

interface LocationPoint {
    lat: number;
    lng: number;
    name: string;
}

const CabHome = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [pickup, setPickup] = useState<LocationPoint | null>(null);
    const [dropoff, setDropoff] = useState<LocationPoint | null>(null);
    const [pickupValue, setPickupValue] = useState("");
    const [dropoffValue, setDropoffValue] = useState("");
    const [gettingLoc, setGettingLoc] = useState<"pickup" | "dropoff" | null>(
        null
    );
    const [routeCoordinates, setRouteCoordinates] = useState<
        [number, number][]
    >([]);

    const mapMarkers: MapboxMarker[] = [
        pickup && {
            id: "pickup",
            lat: pickup.lat,
            lng: pickup.lng,
            label: pickup.name,
            color: "#111111",
        },
        dropoff && {
            id: "dropoff",
            lat: dropoff.lat,
            lng: dropoff.lng,
            label: dropoff.name,
            color: "#555555",
        },
    ].filter(Boolean) as MapboxMarker[];

    const getCurrentLocation = useCallback((target: "pickup" | "dropoff") => {
        if (!navigator.geolocation) return;
        setGettingLoc(target);
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                const point: LocationPoint = {
                    lat: coords.latitude,
                    lng: coords.longitude,
                    name: "Current Location",
                };
                if (target === "pickup") {
                    setPickup(point);
                    setPickupValue(point.name);
                } else {
                    setDropoff(point);
                    setDropoffValue(point.name);
                }
                setGettingLoc(null);
            },
            () => setGettingLoc(null)
        );
    }, []);

    const handleSwap = () => {
        setPickup(dropoff);
        setDropoff(pickup);
        setPickupValue(dropoffValue);
        setDropoffValue(pickupValue);
    };

    const handleSearch = () => {
        if (!pickup || !dropoff) return;

        const distance = calculateDistance(
            pickup.lat,
            pickup.lng,
            dropoff.lat,
            dropoff.lng
        );

        if (distance > 100) {
            toast.error(t(translationKey.cabHome.maxDistanceExceeded));
            return;
        }

        navigate({
            to: "/traveler/cab/search",
            search: {
                pickupLat: pickup.lat,
                pickupLng: pickup.lng,
                dropoffLat: dropoff.lat,
                dropoffLng: dropoff.lng,
            },
        });
    };

    useEffect(() => {
        const fetchRoute = async () => {
            if (!pickup || !dropoff) {
                setRouteCoordinates([]);
                return;
            }

            const distance = calculateDistance(
                pickup.lat,
                pickup.lng,
                dropoff.lat,
                dropoff.lng
            );

            if (distance > 100) {
                setRouteCoordinates([]);
                toast.error(t(translationKey.cabHome.maxDistanceExceeded));
                return;
            }

            try {
                const response = await fetch(
                    `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}?overview=full&geometries=geojson&access_token=${env.VITE_MAPBOX_ACCESS_TOKEN}`
                );
                const data = await response.json();
                const coordinates = data.routes?.[0]?.geometry?.coordinates;
                if (coordinates && coordinates.length > 0) {
                    setRouteCoordinates(coordinates);
                } else {
                    setRouteCoordinates([]);
                    toast.error(t(translationKey.cabHome.noRouteFound));
                }
            } catch (error: any) {
                console.error("Error fetching route:", error);
                setRouteCoordinates([]);
            }
        };

        fetchRoute();
    }, [pickup?.lat, pickup?.lng, dropoff?.lat, dropoff?.lng]);

    const handleSelectPastTrip = (trip: PastTrip) => {
        setPickup({
            lat: trip.pickupLat,
            lng: trip.pickupLng,
            name: trip.pickup,
        });
        setDropoff({
            lat: trip.dropoffLat,
            lng: trip.dropoffLng,
            name: trip.dropoff,
        });
        setPickupValue(trip.pickup);
        setDropoffValue(trip.dropoff);
    };

    return (
        <div className="min-h-screen bg-[#f8f8f8] font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
                <div className="max-w-lg lg:max-w-none mb-6">
                    <CabHomeHeader />
                </div>

                <div className="flex flex-col lg:flex-row lg:gap-8 lg:items-start">
                    <div className="w-full lg:w-[420px] xl:w-[460px] flex-shrink-0 space-y-6">
                        <LocationCard
                            pickupValue={pickupValue}
                            dropoffValue={dropoffValue}
                            isGettingPickup={gettingLoc === "pickup"}
                            isGettingDropoff={gettingLoc === "dropoff"}
                            canSearch={!!pickup && !!dropoff}
                            onPickupRetrieve={(r) => {
                                setPickup(r);
                                setPickupValue(r.name);
                            }}
                            onDropoffRetrieve={(r) => {
                                setDropoff(r);
                                setDropoffValue(r.name);
                            }}
                            onPickupCurrentLocation={() =>
                                getCurrentLocation("pickup")
                            }
                            onDropoffCurrentLocation={() =>
                                getCurrentLocation("dropoff")
                            }
                            onSwap={handleSwap}
                            onSearch={handleSearch}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.16 }}
                            className="lg:hidden overflow-hidden rounded-2xl"
                            style={{
                                boxShadow:
                                    "0 4px 32px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
                            }}
                        >
                            <MapboxMap
                                markers={mapMarkers}
                                routeCoordinates={routeCoordinates}
                                className="h-56"
                            />
                        </motion.div>

                        <PastTripsList
                            trips={PAST_TRIPS}
                            onSelect={handleSelectPastTrip}
                        />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.12 }}
                        className="hidden lg:block flex-1 sticky top-8 overflow-hidden rounded-2xl"
                        style={{
                            boxShadow:
                                "0 8px 48px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.05)",
                            height: "calc(100vh - 5rem)",
                        }}
                    >
                        <MapboxMap
                            markers={mapMarkers}
                            routeCoordinates={routeCoordinates}
                            className="w-full h-full"
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CabHome;
