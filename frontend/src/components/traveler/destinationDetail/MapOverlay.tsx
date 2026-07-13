import { MapPin, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { formatCoordinate } from "./mapMarkerBuilders";
import translationKey from "@/utils/i18n/translationKey";

interface MapOverlayProps {
    lat: number;
    lng: number;
}

function MapOverlay({ lat, lng }: MapOverlayProps) {
    const { t } = useTranslation();

    const openInMaps = () => {
        window.open(
            `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
            "_blank"
        );
    };

    return (
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md rounded-xl px-4 py-2.5 shadow-lg pointer-events-auto">
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <span className="font-mono text-sm text-gray-700 tracking-tight">
                        {formatCoordinate(lat, true)},{" "}
                        {formatCoordinate(lng, false)}
                    </span>
                </div>
            </div>

            <Button
                onClick={openInMaps}
                className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl shadow-lg pointer-events-auto"
            >
                <ExternalLink className="w-4 h-4 mr-2" />
                {t(translationKey.destinationDetail.openInMaps)}
            </Button>
        </div>
    );
}

export default MapOverlay;
