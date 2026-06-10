import { useState, useEffect } from "react";
import { fetchAddressFromCoordinates } from "@/utils/mapbox";
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
                const addr = await fetchAddressFromCoordinates(coordinate);
                if (!cancelled) {
                    setAddress(addr);
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
