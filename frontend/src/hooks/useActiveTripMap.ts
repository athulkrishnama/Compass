import { useState, useEffect, useMemo } from "react";
import { fetchRouteCoordinates } from "@/utils/mapbox";
import { RIDE_STATUSES, type RideStatus } from "@/types/rideStatus";
import type { Coordinate } from "@/types/coordinate";
import type { MapboxMarker } from "@/components/shared/MapboxMap";

interface UseActiveTripMapOptions {
    phase: RideStatus;
    pickupCoordinate: Coordinate;
    dropoffCoordinate: Coordinate;
}

interface UseActiveTripMapReturn {
    driverCoordinate: Coordinate | null;
    routeCoordinates: [number, number][];
    markers: MapboxMarker[];
    mapCenter: [number, number] | undefined;
}

export function useActiveTripMap({
    phase,
    pickupCoordinate,
    dropoffCoordinate,
}: UseActiveTripMapOptions): UseActiveTripMapReturn {
    const [driverCoordinate, setDriverCoordinate] = useState<Coordinate | null>(
        null
    );
    const [routeCoordinates, setRouteCoordinates] = useState<
        [number, number][]
    >([]);

    useEffect(() => {
        if (!navigator.geolocation) return;

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                setDriverCoordinate({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                });
            },
            (err) => {
                console.warn("Geolocation error:", err.message);
            },
            { enableHighAccuracy: true, maximumAge: 5000 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    useEffect(() => {
        let cancelled = false;

        const fetchRoute = async () => {
            try {
                let from: Coordinate | null = null;
                let to: Coordinate | null = null;

                if (phase === RIDE_STATUSES.MATCHED && driverCoordinate) {
                    from = driverCoordinate;
                    to = pickupCoordinate;
                } else if (phase === RIDE_STATUSES.IN_TRANSIT) {
                    from = pickupCoordinate;
                    to = dropoffCoordinate;
                }

                if (!from || !to) {
                    setRouteCoordinates((prev) =>
                        prev.length === 0 ? prev : []
                    );
                    return;
                }

                const coords = await fetchRouteCoordinates(from, to);
                if (!cancelled) setRouteCoordinates(coords);
            } catch {
                if (!cancelled)
                    setRouteCoordinates((prev) =>
                        prev.length === 0 ? prev : []
                    );
            }
        };

        fetchRoute();
        return () => {
            cancelled = true;
        };
    }, [phase, driverCoordinate, pickupCoordinate, dropoffCoordinate]);

    const markers = useMemo<MapboxMarker[]>(() => {
        const list: MapboxMarker[] = [];

        if (phase === RIDE_STATUSES.MATCHED) {
            if (driverCoordinate) {
                list.push({
                    id: "driver",
                    lat: driverCoordinate.latitude,
                    lng: driverCoordinate.longitude,
                    label: "You",
                    color: "#000000",
                });
            }
            list.push({
                id: "pickup",
                lat: pickupCoordinate.latitude,
                lng: pickupCoordinate.longitude,
                label: "Pickup",
                color: "#22c55e",
            });
        } else if (phase === RIDE_STATUSES.ARRIVED) {
            list.push({
                id: "pickup",
                lat: pickupCoordinate.latitude,
                lng: pickupCoordinate.longitude,
                label: "Pickup",
                color: "#22c55e",
            });
        } else if (phase === RIDE_STATUSES.IN_TRANSIT) {
            list.push({
                id: "pickup",
                lat: pickupCoordinate.latitude,
                lng: pickupCoordinate.longitude,
                label: "Pickup",
                color: "#000000",
            });
            list.push({
                id: "dropoff",
                lat: dropoffCoordinate.latitude,
                lng: dropoffCoordinate.longitude,
                label: "Dropoff",
                color: "#ef4444",
            });
        }

        return list;
    }, [phase, driverCoordinate, pickupCoordinate, dropoffCoordinate]);

    const mapCenter = useMemo<[number, number] | undefined>(() => {
        if (driverCoordinate) {
            return [driverCoordinate.longitude, driverCoordinate.latitude];
        }
        return [pickupCoordinate.longitude, pickupCoordinate.latitude];
    }, [driverCoordinate, pickupCoordinate]);

    return { driverCoordinate, routeCoordinates, markers, mapCenter };
}
