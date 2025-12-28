import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

interface ImageScrollProps {
    images: string[];
}

const ImageScroll: React.FC<ImageScrollProps> = ({ images }) => {
    const { t } = useTranslation();

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div className="w-full overflow-x-auto overflow-y-hidden hide-scroll-bar">
            <motion.div
                className="flex gap-4 w-max px-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {images.map((src, index) => (
                    <div key={index} className="relative h-64 flex-shrink-0">
                        <img
                            src={src}
                            alt={`${t("text.vehicleImage")} ${index + 1}`}
                            className="h-full w-auto object-cover rounded-lg shadow-md"
                        />
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default ImageScroll;
