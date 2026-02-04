import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface RoomImageGalleryProps {
    coverImage: string;
    images: string[];
    roomName: string;
}

export default function RoomImageGallery({
    coverImage,
    images,
    roomName,
}: RoomImageGalleryProps) {
    const { t } = useTranslation();
    const allImages = [coverImage, ...images].filter(Boolean);
    const [selectedImage, setSelectedImage] = useState(coverImage);

    if (allImages.length === 0) {
        return (
            <div className="w-full aspect-[21/9] bg-gray-100 rounded-3xl flex items-center justify-center border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">
                    {t(translationKey.roomDetails.noImagesFound)}
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-4">
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl shadow-2xl border border-gray-100">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={selectedImage}
                        src={selectedImage}
                        alt={roomName}
                        className="w-full h-full object-cover"
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                </AnimatePresence>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 hide-scroll-bar">
                {allImages.map((image, index) => (
                    <motion.button
                        key={index}
                        onClick={() => setSelectedImage(image)}
                        className={`relative flex-shrink-0 w-44 aspect-[3/2] rounded-2xl overflow-hidden transition-all duration-300 ${
                            selectedImage === image
                                ? "ring-4 ring-gray-900 ring-offset-2 scale-95"
                                : "opacity-60 hover:opacity-100 hover:scale-105"
                        }`}
                        whileTap={{ scale: 0.9 }}
                    >
                        <img
                            src={image}
                            alt={`${roomName} view ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                        {selectedImage === image && (
                            <div className="absolute inset-0 bg-black/10" />
                        )}
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
