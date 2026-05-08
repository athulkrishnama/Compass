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
