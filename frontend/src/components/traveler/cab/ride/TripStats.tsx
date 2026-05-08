import { Clock, Route, IndianRupee } from "lucide-react";
import type { FareOption } from "@/types/api/fareOption";
import { CAB_IMAGE_MAP } from "@/constants/cabConstants";
import type { VehicleType } from "@/types/vehicleType";

interface TripStatsProps {
    distance: number;
    time: number;
    selectedFare: FareOption;
}

const StatItem = ({
    icon: Icon,
    value,
    unit,
}: {
    icon: typeof Route;
    value: string;
    unit: string;
}) => (
    <div className="flex flex-col items-center gap-1 py-4 px-2 rounded-xl border border-neutral-100 bg-white">
        <Icon className="w-4 h-4 text-neutral-400" />
        <span className="text-base font-bold text-black">{value}</span>
        <span className="text-[10px] text-neutral-400 uppercase tracking-widest">
            {unit}
        </span>
    </div>
);

const TripStats = ({ distance, time, selectedFare }: TripStatsProps) => {
    const distanceKm = (distance / 1000).toFixed(1);
    const durationMin = Math.round(time / 60);
    const cabImage = CAB_IMAGE_MAP[selectedFare.cab_type as VehicleType];

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl border border-neutral-100 bg-white">
                <img
                    src={cabImage}
                    alt={selectedFare.cab_type}
                    className="w-16 h-10 object-contain"
                />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-black">
                        {selectedFare.cab_type}
                    </p>
                    <p className="text-xs text-neutral-400">
                        ₹{selectedFare.fare}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <StatItem icon={Route} value={distanceKm} unit="km" />
                <StatItem icon={Clock} value={String(durationMin)} unit="min" />
                <StatItem
                    icon={IndianRupee}
                    value={`₹${selectedFare.fare}`}
                    unit="fare"
                />
            </div>
        </div>
    );
};

export default TripStats;
