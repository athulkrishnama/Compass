import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

interface HotelInfoCardProps {
    hotel: {
        id: string;
        name: string;
        coverImage: string;
        city: string;
        landMark: string;
    };
}

export function HotelInfoCard({ hotel }: HotelInfoCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative rounded-2xl overflow-hidden h-[340px] sm:h-[380px] group shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
            <img
                src={hotel.coverImage}
                alt={hotel.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6">
                <h2 className="text-2xl font-bold text-white">{hotel.name}</h2>
                <div className="flex items-center text-white/80 mt-1.5 gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">
                        {hotel.landMark}, {hotel.city}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
