import { motion } from "framer-motion";

interface RoomHeaderProps {
    name: string;
    description: string;
}

export default function RoomHeader({ name, description }: RoomHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
        >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {name}
            </h1>

            <p className="text-lg text-gray-600 line-clamp-2">{description}</p>
        </motion.div>
    );
}
