import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
    previewImages: { existing: boolean; url: string; index?: number }[];
    onRemove: (index: number, existing: boolean) => void;
}

function ImagePreview({ previewImages, onRemove }: ImagePreviewProps) {
    return (
        <AnimatePresence>
            {previewImages.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                        opacity: 1,
                        height: "auto",
                    }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-row gap-4 overflow-x-auto pb-4 hide-scroll-bar"
                >
                    {previewImages.map((image, index) => (
                        <div
                            key={index}
                            className="relative group rounded-lg overflow-hidden h-60 w-80 shrink-0 border"
                        >
                            <img
                                src={image.url}
                                alt={`Preview ${index}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <Button
                                    type="button"
                                    size="icon"
                                    className="h-8 w-8 rounded-full bg-white/80 hover:bg-red-500 hover:text-white text-gray-700 transition-colors shadow-sm"
                                    onClick={() =>
                                        onRemove(index, image.existing)
                                    }
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default ImagePreview;
