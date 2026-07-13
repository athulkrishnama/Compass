import { useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import MapboxMap, { type MapboxMarker } from "@/components/shared/MapboxMap";
import { createSearchNearbyHotelsQueryOptions } from "@/queryOptions/hotelQueryOptions";
import type { IHotelWithRoomVariantDetails } from "@/types/api/responses/hotelSearchResponse";
import MapSectionHeader from "./MapSectionHeader";
import MapOverlay from "./MapOverlay";
import HotelChipList from "./HotelChipList";
import {
    HOTEL_SPREAD_RADIUS,
    buildDestinationMarkerHTML,
    buildHotelMarkerHTML,
    buildHotelPopupHTML,
} from "./mapMarkerBuilders";

interface DestinationMapSectionProps {
    coordinates: [number, number]; // [lat, lng]
    name: string;
}

function DestinationMapSection({
    coordinates,
    name,
}: DestinationMapSectionProps) {
    const [lat, lng] = coordinates;

    const { data: hotelsData } = useQuery(
        createSearchNearbyHotelsQueryOptions([lng, lat], 15)
    );
    const hotels: IHotelWithRoomVariantDetails[] = useMemo(
        () => hotelsData?.data?.hotels ?? [],
        [hotelsData]
    );

    const destinationMarker: MapboxMarker = useMemo(
        () => ({
            id: "destination",
            lat,
            lng,
            label: name,
            customElementHTML: buildDestinationMarkerHTML(name),
        }),
        [lat, lng, name]
    );

    const hotelMarkers: MapboxMarker[] = useMemo(() => {
        const count = hotels.length;
        return hotels.map((hotel, index) => {
            const angle =
                count === 1 ? Math.PI / 2 : (index * 2 * Math.PI) / count;
            return {
                id: `hotel-${hotel.id}`,
                lat: lat + HOTEL_SPREAD_RADIUS * Math.sin(angle),
                lng: lng + HOTEL_SPREAD_RADIUS * Math.cos(angle),
                label: hotel.name,
                skipBounds: true,
                customElementHTML: buildHotelMarkerHTML(hotel),
                popupHTML: buildHotelPopupHTML(hotel),
            };
        });
    }, [hotels, lat, lng]);

    const allMarkers: MapboxMarker[] = useMemo(
        () => [destinationMarker, ...hotelMarkers],
        [destinationMarker, hotelMarkers]
    );

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-12"
        >
            <MapSectionHeader hotelCount={hotels.length} />

            <div className="relative h-[340px] md:h-[440px] rounded-2xl overflow-hidden shadow-lg ring-1 ring-gray-200">
                <MapboxMap
                    markers={allMarkers}
                    initialCenter={[lng, lat]}
                    initialZoom={13}
                    className="h-full"
                    fitBoundsPadding={{
                        top: 100,
                        bottom: 80,
                        left: 80,
                        right: 80,
                    }}
                />
                <MapOverlay lat={lat} lng={lng} />
            </div>

            <HotelChipList hotels={hotels} />
        </motion.section>
    );
}

export default DestinationMapSection;
