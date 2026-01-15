import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";

interface HotelCoverImageProps {
    coverImage: string | null;
    name: string;
}

function HotelCoverImage({ coverImage, name }: HotelCoverImageProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full aspect-[16/7] rounded-2xl overflow-hidden bg-gray-200"
        >
            {coverImage ? (
                <img
                    src={coverImage}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon className="w-16 h-16" />
                </div>
            )}
        </motion.div>
    );
}

export default HotelCoverImage;
