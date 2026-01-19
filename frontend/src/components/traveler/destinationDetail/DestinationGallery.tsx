import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import translationKey from "@/utils/i18n/translationKey";

interface DestinationGalleryProps {
    images: string[];
    name: string;
}

function DestinationGallery({ images, name }: DestinationGalleryProps) {
    const { t } = useTranslation();
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    if (images.length === 0) {
        return null;
    }

    const openLightbox = (index: number) => setSelectedIndex(index);
    const closeLightbox = () => setSelectedIndex(null);

    const goToPrevious = () => {
        if (selectedIndex !== null) {
            setSelectedIndex(
                selectedIndex === 0 ? images.length - 1 : selectedIndex - 1
            );
        }
    };

    const goToNext = () => {
        if (selectedIndex !== null) {
            setSelectedIndex(
                selectedIndex === images.length - 1 ? 0 : selectedIndex + 1
            );
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12"
        >
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">
                {t(translationKey.destinationDetail.photoGallery)}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 * index }}
                        whileHover={{ scale: 1.03 }}
                        className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                        onClick={() => openLightbox(index)}
                    >
                        <img
                            src={image}
                            alt={`${name} - ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                        onClick={closeLightbox}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 text-white hover:bg-white/10 z-10"
                            onClick={closeLightbox}
                        >
                            <X className="w-6 h-6" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 text-white hover:bg-white/10 z-10"
                            onClick={(e) => {
                                e.stopPropagation();
                                goToPrevious();
                            }}
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 text-white hover:bg-white/10 z-10"
                            onClick={(e) => {
                                e.stopPropagation();
                                goToNext();
                            }}
                        >
                            <ChevronRight className="w-8 h-8" />
                        </Button>

                        <motion.img
                            key={selectedIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            src={images[selectedIndex]}
                            alt={`${name} - ${selectedIndex + 1}`}
                            className="max-h-[85vh] max-w-[85vw] object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
                            {selectedIndex + 1} / {images.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.section>
    );
}

export default DestinationGallery;
