import { MapPin, Navigation } from "lucide-react";
import { useReverseGeocode } from "@/hooks/useReverseGeocode";
import type { Coordinate } from "@/types/coordinate";

interface RideLocationsProps {
    pickup: Coordinate;
    dropoff: Coordinate;
}

const LocationItem = ({
    coordinate,
    icon: Icon,
    label,
    iconBg,
}: {
    coordinate: Coordinate;
    icon: typeof MapPin;
    label: string;
    iconBg: string;
}) => {
    const { address, loading } = useReverseGeocode(coordinate);

    return (
        <div className="flex items-start gap-3">
            <div
                className={`mt-0.5 w-8 h-8 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0 shadow-sm`}
            >
                <Icon className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
                    {label}
                </p>
                {loading ? (
                    <div className="mt-1 h-4 w-48 bg-neutral-100 rounded animate-pulse" />
                ) : (
                    <p className="text-sm font-medium text-black mt-0.5 leading-snug truncate">
                        {address}
                    </p>
                )}
            </div>
        </div>
    );
};

const RideLocations = ({ pickup, dropoff }: RideLocationsProps) => {
    return (
        <div className="space-y-3">
            <LocationItem
                coordinate={pickup}
                icon={MapPin}
                label="Pickup"
                iconBg="bg-black"
            />

            <div className="ml-4 border-l-2 border-dashed border-neutral-200 h-5" />

            <LocationItem
                coordinate={dropoff}
                icon={Navigation}
                label="Drop-off"
                iconBg="bg-neutral-700"
            />
        </div>
    );
};

export default RideLocations;
