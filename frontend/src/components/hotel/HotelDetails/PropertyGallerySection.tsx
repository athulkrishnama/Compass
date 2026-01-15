import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Image as ImageIcon } from "lucide-react";
import translationKey from "@/utils/i18n/translationKey";

interface PropertyGallerySectionProps {
    images: string[];
    maxImages?: number;
}

function PropertyGallerySection({
    images,
    maxImages = 6,
}: PropertyGallerySectionProps) {
    const { t } = useTranslation();

    // Show only actual images, up to the limit
    const displayImages = images.slice(0, maxImages);

    if (displayImages.length === 0) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
            <div className="flex items-center gap-2 mb-6">
                <ImageIcon className="w-4 h-4 text-gray-500" />
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {t(translationKey.sections.propertyGallery)}
                </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {displayImages.map((image, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                        className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200"
                    >
                        <img
                            src={image}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

export default PropertyGallerySection;
