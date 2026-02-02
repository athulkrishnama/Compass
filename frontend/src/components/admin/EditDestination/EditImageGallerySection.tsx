import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Image, Upload, X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Modal from "@/components/shared/modal/Modal";
import translationKey from "@/utils/i18n/translationKey";
import SectionCard from "../AddDestination/SectionCard";
import ImageCropper from "@/components/shared/ImageCropper/ImageCropper";

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export interface ImageItem {
    existing: boolean;
    url: string;
    index: number;
}

interface EditImageGallerySectionProps {
    existingCoverImage: string | null;
    existingGalleryImages: string[];
    newCoverImage: File | null;
    newGalleryImages: File[];
    onNewCoverImageChange: (file: File | null) => void;
    onNewGalleryImagesAdd: (files: File[]) => void;
    onNewGalleryImageRemove: (index: number) => void;
    onExistingGalleryImageDelete: (index: number) => void;
    deletedGalleryImageIndexes: number[];
}

function EditImageGallerySection({
    existingCoverImage,
    existingGalleryImages,
    newCoverImage,
    newGalleryImages,
    onNewCoverImageChange,
    onNewGalleryImagesAdd,
    onNewGalleryImageRemove,
    onExistingGalleryImageDelete,
    deletedGalleryImageIndexes,
}: EditImageGallerySectionProps) {
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
            onNewCoverImageChange(croppedImage);
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
            onNewGalleryImagesAdd(validFiles);
        }
        e.target.value = "";
    };

    const displayCoverImage = newCoverImage
        ? URL.createObjectURL(newCoverImage)
        : existingCoverImage;
    const visibleExistingGalleryImages = existingGalleryImages
        .map((url, index) => ({ url, index, existing: true }))
        .filter((img) => !deletedGalleryImageIndexes.includes(img.index));

    const newGalleryImageItems = newGalleryImages.map((file, index) => ({
        url: URL.createObjectURL(file),
        index,
        existing: false,
    }));

    return (
        <>
            <SectionCard
                icon={Image}
                title={t(translationKey.sections.imageGallery)}
            >
                <div className="space-y-6">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                            {t(translationKey.form.coverImage)}
                        </p>
                        <input
                            type="file"
                            ref={coverInputRef}
                            onChange={handleCoverImageSelect}
                            accept="image/*"
                            className="hidden"
                        />

                        {displayCoverImage ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="relative w-full aspect-video rounded-lg overflow-hidden group"
                            >
                                <img
                                    src={displayCoverImage}
                                    alt="Cover"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        coverInputRef.current?.click()
                                    }
                                    className="absolute bottom-2 right-2 px-3 py-1.5 bg-white/90 hover:bg-white rounded-lg text-sm font-medium text-gray-700 shadow-sm transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    {t(translationKey.button.change)}
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
                                    {t(translationKey.form.uploadCoverImage)}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {t(
                                        translationKey.form.uploadCoverImageHint
                                    )}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                            {t(translationKey.form.galleryImages)}
                        </p>
                        <input
                            type="file"
                            ref={galleryInputRef}
                            onChange={handleGalleryImageSelect}
                            accept="image/*"
                            multiple
                            className="hidden"
                        />

                        {visibleExistingGalleryImages.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs text-gray-500">
                                    {t(translationKey.text.existingImages)}
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <AnimatePresence>
                                        {visibleExistingGalleryImages.map(
                                            (img) => (
                                                <motion.div
                                                    key={`existing-${img.index}`}
                                                    initial={{
                                                        opacity: 0,
                                                        scale: 0.8,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        scale: 1,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        scale: 0.8,
                                                    }}
                                                    className="relative w-24 h-24 rounded-lg overflow-hidden group"
                                                >
                                                    <img
                                                        src={img.url}
                                                        alt={`Gallery ${img.index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onExistingGalleryImageDelete(
                                                                img.index
                                                            )
                                                        }
                                                        className="absolute top-1 right-1 p-0.5 bg-white rounded-full 
                                                        shadow-md hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </motion.div>
                                            )
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            {newGalleryImageItems.length > 0 && (
                                <p className="text-xs text-gray-500">
                                    {t(translationKey.text.newImages)}
                                </p>
                            )}
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        galleryInputRef.current?.click()
                                    }
                                    className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg 
                                    flex flex-col items-center justify-center cursor-pointer
                                    hover:border-gray-400 hover:bg-gray-50 transition-colors"
                                >
                                    <Plus className="w-5 h-5 text-gray-400" />
                                    <span className="text-xs text-gray-400 mt-1">
                                        {t(translationKey.button.addImage)}
                                    </span>
                                </button>

                                <AnimatePresence>
                                    {newGalleryImageItems.map((img) => (
                                        <motion.div
                                            key={`new-${img.index}`}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="relative w-24 h-24 rounded-lg overflow-hidden group"
                                        >
                                            <img
                                                src={img.url}
                                                alt={`New Gallery ${img.index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onNewGalleryImageRemove(
                                                        img.index
                                                    )
                                                }
                                                className="absolute top-1 right-1 p-0.5 bg-white rounded-full 
                                                shadow-md hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
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

export default EditImageGallerySection;
