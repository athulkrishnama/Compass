import { motion } from "framer-motion";
import { MapPin, Clock, Calendar, IndianRupee } from "lucide-react";
import { useReverseGeocode } from "@/hooks/useReverseGeocode";
import type { IRiderPastTripResponseDTO } from "@/types/api/responses/rideResponses";

export type PastTrip = IRiderPastTripResponseDTO;

interface PastTripCardProps {
    trip: PastTrip;
    index: number;
    onSelect: (
        trip: PastTrip,
        pickupAddress: string,
        dropoffAddress: string
    ) => void;
}

const PastTripCard = ({ trip, index, onSelect }: PastTripCardProps) => {
    const { address: pickupAddress } = useReverseGeocode(trip.pickup_point);
    const { address: dropoffAddress } = useReverseGeocode(trip.dropoff_point);

    // Format duration from seconds to minutes
    const durationMins = Math.ceil(trip.time / 60);

    return (
        <motion.button
            key={trip._id}
            type="button"
            onClick={() => onSelect(trip, pickupAddress, dropoffAddress)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.28 + index * 0.07 }}
            className="w-full text-left bg-white rounded-2xl p-4 hover:bg-zinc-50 active:scale-[0.99] transition-all duration-150 group"
            style={{
                boxShadow:
                    "0 2px 20px rgba(0,0,0,0.055), 0 1px 3px rgba(0,0,0,0.035)",
            }}
        >
            {/* Route */}
            <div className="flex items-start gap-3 mb-3">
                <div className="flex flex-col items-center gap-1 flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full border-[1.5px] border-black" />
                    <div className="w-px h-5 bg-zinc-200" />
                    <div className="w-2 h-2 rounded-sm bg-black" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-800 truncate leading-snug">
                        {pickupAddress || "Loading pickup..."}
                    </p>
                    <p className="text-xs text-zinc-400 mt-1.5 truncate leading-snug">
                        {dropoffAddress || "Loading drop-off..."}
                    </p>
                </div>
                <MapPin className="w-4 h-4 text-zinc-300 flex-shrink-0 mt-0.5 group-hover:text-zinc-500 transition-colors" />
            </div>

            {/* Meta */}
            <div className="flex items-center gap-4 text-[11px] text-zinc-400 font-medium border-t border-zinc-100 pt-2.5">
                <span className="flex items-center gap-1 text-zinc-700">
                    <IndianRupee className="w-3 h-3" />
                    {trip.selected_fare.fare}
                </span>
                <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {durationMins} min
                </span>
                <span className="flex items-center gap-1 ml-auto text-zinc-500">
                    <Calendar className="w-3 h-3" />
                    {trip.date}
                </span>
            </div>
        </motion.button>
    );
};

export default PastTripCard;
