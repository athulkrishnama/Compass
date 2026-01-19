import { motion } from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { env } from "@/config/env";

interface DestinationMapSectionProps {
    coordinates: [number, number];
}

function DestinationMapSection({ coordinates }: DestinationMapSectionProps) {
    const [lat, lng] = coordinates;

    const formatCoordinate = (value: number, isLatitude: boolean) => {
        const direction = isLatitude
            ? value >= 0
                ? "N"
                : "S"
            : value >= 0
              ? "E"
              : "W";
        return `${Math.abs(value).toFixed(4)}° ${direction}`;
    };

    const openInMaps = () => {
        window.open(
            `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
            "_blank"
        );
    };

    const mapboxStaticUrl = `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/pin-l+000(${lng},${lat})/${lng},${lat},12,0/800x400@2x?access_token=${env.VITE_MAPBOX_ACCESS_TOKEN}`;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-12"
        >
            <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden">
                <img
                    src={mapboxStaticUrl}
                    alt="Destination location map"
                    className="w-full h-full object-cover"
                />

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="bg-white/90 backdrop-blur-md rounded-xl px-4 py-2.5 shadow-lg">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-700" />
                            <span className="font-mono text-sm text-gray-700">
                                {formatCoordinate(lat, true)},{" "}
                                {formatCoordinate(lng, false)}
                            </span>
                        </div>
                    </div>

                    <Button
                        onClick={openInMaps}
                        className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl shadow-lg"
                    >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open in Maps
                    </Button>
                </div>
            </div>
        </motion.section>
    );
}

export default DestinationMapSection;
