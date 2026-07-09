import { motion } from "framer-motion";
import { Hotel } from "lucide-react";
import type { IHotelWithRoomVariantDetails } from "@/types/api/responses/hotelSearchResponse";

interface HotelChipProps {
    hotel: IHotelWithRoomVariantDetails;
}

function HotelChip({ hotel }: HotelChipProps) {
    const cheapest =
        hotel.roomVariants?.length > 0
            ? Math.min(...hotel.roomVariants.map((rv) => rv.price))
            : null;

    return (
        <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm ring-1 ring-gray-100 hover:ring-indigo-200 hover:shadow-md transition-all duration-200 group cursor-default">
            {hotel.coverImage ? (
                <img
                    src={hotel.coverImage}
                    alt={hotel.name}
                    className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                />
            ) : (
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <Hotel className="w-4 h-4 text-indigo-400" />
                </div>
            )}
            <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate max-w-[140px] group-hover:text-indigo-700 transition-colors">
                    {hotel.name}
                </p>
                {cheapest !== null && (
                    <p className="text-xs text-gray-500">
                        From ₹{cheapest.toLocaleString("en-IN")}/night
                    </p>
                )}
            </div>
        </div>
    );
}

interface HotelChipListProps {
    hotels: IHotelWithRoomVariantDetails[];
}

function HotelChipList({ hotels }: HotelChipListProps) {
    if (hotels.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="mt-4 flex flex-wrap gap-2"
        >
            {hotels.map((hotel) => (
                <HotelChip key={hotel.id} hotel={hotel} />
            ))}
        </motion.div>
    );
}

export default HotelChipList;
