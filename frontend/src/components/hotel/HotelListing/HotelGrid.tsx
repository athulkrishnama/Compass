import { motion } from "framer-motion";
import { HotelCard } from "./HotelCard";
import type { Hotel } from "@/types/api/responses/getHotelsByUserId";

interface HotelGridProps {
    hotels: Hotel[];
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function HotelGrid({ hotels }: HotelGridProps) {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
            {hotels.map((hotel) => (
                <motion.div key={hotel.id} variants={item}>
                    <HotelCard hotel={hotel} />
                </motion.div>
            ))}
        </motion.div>
    );
}
