import { useState, useEffect } from "react";
import { env } from "@/config/env";
import type { Coordinate } from "@/types/coordinate";

export function useReverseGeocode(coordinate: Coordinate | undefined) {
    const [address, setAddress] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!coordinate) return;

        let cancelled = false;

        const fetchAddress = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinate.longitude},${coordinate.latitude}.json?access_token=${env.VITE_MAPBOX_ACCESS_TOKEN}&limit=1`
                );
                const data = await res.json();
                const placeName = data.features?.[0]?.place_name;
                if (!cancelled && placeName) {
                    setAddress(placeName);
                }
            } catch {
                if (!cancelled) {
                    setAddress(
                        `${coordinate.latitude.toFixed(5)}, ${coordinate.longitude.toFixed(5)}`
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchAddress();

        return () => {
            cancelled = true;
        };
    }, [coordinate]);

    return { address, loading };
}
