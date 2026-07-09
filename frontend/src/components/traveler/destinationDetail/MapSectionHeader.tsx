import { MapPin, Hotel } from "lucide-react";

interface MapSectionHeaderProps {
    hotelCount: number;
}

function MapSectionHeader({ hotelCount }: MapSectionHeaderProps) {
    return (
        <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-red-500" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-900">
                    Location &amp; Nearby Hotels
                </h2>
                {hotelCount > 0 && (
                    <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                        <Hotel className="w-3.5 h-3.5" />
                        {hotelCount} hotel{hotelCount !== 1 ? "s" : ""} within
                        15 km
                    </p>
                )}
            </div>
        </div>
    );
}

export default MapSectionHeader;
