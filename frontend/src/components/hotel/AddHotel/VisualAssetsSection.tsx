import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Image, Upload, X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Modal from "@/components/shared/modal/Modal";
import translationKey from "@/utils/i18n/translationKey";
import SectionCard from "./SectionCard";
import ImageCropper from "@/components/shared/ImageCropper/ImageCropper";

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface VisualAssetsSectionProps {
    coverImage: File | null;
    galleryImages: File[];
    onCoverImageChange: (file: File | null) => void;
    onGalleryImagesAdd: (files: File[]) => void;
    onGalleryImageRemove: (index: number) => void;
}

function VisualAssetsSection({
    coverImage,
    galleryImages,
    onCoverImageChange,
    onGalleryImagesAdd,
    onGalleryImageRemove,
}: VisualAssetsSectionProps) {
    const { t } = useTranslation();

    const [showCropper, setShowCropper] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const validateImage = (file: File): boolean => {
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            toast.error(t(translationKey.errors.unsupportedImageFormat));
            return false;
        }
        if (file.size > MAX_FILE_SIZE) {
            toast.error(t(translationKey.errors.maxFileSize, { size: "10MB" }));
            return false;
        }
        return true;
    };

    const handleCoverImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (validateImage(file)) {
                setSelectedImage(file);
                setShowCropper(true);
            }
        }
        e.target.value = "";
    };

    const handleCropComplete = (croppedImage?: File) => {
        if (croppedImage) {
            onCoverImageChange(croppedImage);
        }
        setShowCropper(false);
        setSelectedImage(null);
    };

    const handleGalleryImageSelect = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(e.target.files || []);
        const validFiles = files.filter((file) => validateImage(file));
        if (validFiles.length > 0) {
            onGalleryImagesAdd(validFiles);
        }
        e.target.value = "";
    };

    const handleRemoveCoverImage = () => {
        onCoverImageChange(null);
    };

    return (
        <>
            <SectionCard
                icon={Image}
                title={t(translationKey.sections.visualAssets)}
            >
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                {t(translationKey.form.coverImage)}
                            </p>
                            <p className="text-xs text-gray-400">
                                {t(translationKey.text.coverImageRequirements)}
                            </p>
                        </div>
                        <input
                            type="file"
                            ref={coverInputRef}
                            onChange={handleCoverImageSelect}
                            accept="image/*"
                            className="hidden"
                        />

                        {coverImage ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200"
                            >
                                <img
                                    src={URL.createObjectURL(coverImage)}
                                    alt="Cover"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveCoverImage}
                                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md 
                                        hover:bg-gray-100 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ) : (
                            <div
                                onClick={() => coverInputRef.current?.click()}
                                className="w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg 
                                    flex flex-col items-center justify-center cursor-pointer
                                    hover:border-gray-400 hover:bg-gray-50 transition-colors"
                            >
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-600">
                                    {t(translationKey.text.clickToUploadCover)}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                {t(translationKey.form.galleryImages)}
                            </p>
                            <p className="text-xs text-gray-400">
                                {t(translationKey.text.imagesSelected, {
                                    count: galleryImages.length,
                                })}
                            </p>
                        </div>
                        <input
                            type="file"
                            ref={galleryInputRef}
                            onChange={handleGalleryImageSelect}
                            accept="image/*"
                            multiple
                            className="hidden"
                        />
                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => galleryInputRef.current?.click()}
                                className="w-28 h-28 border-2 border-dashed border-gray-300 rounded-lg 
                                    flex flex-col items-center justify-center cursor-pointer
                                    hover:border-gray-400 hover:bg-gray-50 transition-colors"
                            >
                                <Plus className="w-5 h-5 text-gray-400" />
                                <span className="text-xs text-gray-400 mt-1">
                                    {t(translationKey.text.addImage)}
                                </span>
                            </button>

                            <AnimatePresence>
                                {galleryImages.map((img, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="relative w-28 h-28 rounded-lg overflow-hidden border border-gray-200"
                                    >
                                        <img
                                            src={URL.createObjectURL(img)}
                                            alt={`Gallery ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onGalleryImageRemove(index)
                                            }
                                            className="absolute top-1 right-1 p-0.5 bg-white rounded-full 
                                                shadow-md hover:bg-gray-100 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </SectionCard>

            <Modal
                isOpen={showCropper}
                handleClose={() => setShowCropper(false)}
            >
                {selectedImage && (
                    <ImageCropper
                        image={selectedImage}
                        ratio={16 / 9}
                        onCropComplete={handleCropComplete}
                    />
                )}
            </Modal>
        </>
    );
}

export default VisualAssetsSection;
