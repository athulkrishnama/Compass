import { AnimatePresence, motion } from "framer-motion";

interface ImagePreviewProps {
    previewImages: string[];
}

function ImagePreview({ previewImages }: ImagePreviewProps) {
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
                    className="grid grid-cols-3 gap-2"
                >
                    {previewImages.map((src, index) => (
                        <div
                            key={index}
                            className="relative aspect-video rounded-md overflow-hidden group"
                        >
                            <img
                                src={src}
                                alt={`Preview ${index}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default ImagePreview;
