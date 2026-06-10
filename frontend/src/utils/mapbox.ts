import { env } from "@/config/env";
import type { Coordinate } from "@/types/coordinate";

export async function fetchRouteCoordinates(
    pickup: Coordinate,
    dropoff: Coordinate
): Promise<[number, number][]> {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup.longitude},${pickup.latitude};${dropoff.longitude},${dropoff.latitude}?overview=full&geometries=geojson&access_token=${env.VITE_MAPBOX_ACCESS_TOKEN}`;
    const res = await fetch(url);
    const data = await res.json();
    const coords = data.routes?.[0]?.geometry?.coordinates;
    return coords?.length ? coords : [];
}

export async function fetchAddressFromCoordinates(
    coordinate: Coordinate
): Promise<string> {
    try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinate.longitude},${coordinate.latitude}.json?access_token=${env.VITE_MAPBOX_ACCESS_TOKEN}&limit=1`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        const placeName = data.features?.[0]?.place_name;
        return (
            placeName ||
            `${coordinate.latitude.toFixed(5)}, ${coordinate.longitude.toFixed(5)}`
        );
    } catch (error) {
        console.error("Error reverse geocoding:", error);
        return `${coordinate.latitude.toFixed(5)}, ${coordinate.longitude.toFixed(5)}`;
    }
}
