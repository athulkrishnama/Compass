import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Image, Upload, X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Modal from "@/components/shared/modal/Modal";
import translationKey from "@/utils/i18n/translationKey";
import SectionCard from "../AddHotel/SectionCard";
import ImageCropper from "@/components/shared/ImageCropper/ImageCropper";

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface EditVisualAssetsSectionProps {
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

function EditVisualAssetsSection({
    existingCoverImage,
    existingGalleryImages,
    newCoverImage,
    newGalleryImages,
    onNewCoverImageChange,
    onNewGalleryImagesAdd,
    onNewGalleryImageRemove,
    onExistingGalleryImageDelete,
    deletedGalleryImageIndexes,
}: EditVisualAssetsSectionProps) {
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
                title={t(translationKey.sections.visualAssets)}
            >
                <div className="space-y-6">
                    {/* Cover Image Section */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-700 uppercase tracking-wider">
                                {t(translationKey.form.coverImage)}
                            </p>
                            {displayCoverImage && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        coverInputRef.current?.click()
                                    }
                                    className="text-xs font-medium text-gray-600 hover:text-gray-900 uppercase tracking-wider"
                                >
                                    {t(translationKey.button.changeImage)}
                                </button>
                            )}
                        </div>
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

                    {/* Gallery Images Section */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-700 uppercase tracking-wider">
                                {t(translationKey.form.galleryImages)}
                            </p>
                            <p className="text-xs text-gray-500">
                                {visibleExistingGalleryImages.length +
                                    newGalleryImages.length}{" "}
                                {t(translationKey.text.imagesUploaded)}
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
                            {/* Add Image Button */}
                            <button
                                type="button"
                                onClick={() => galleryInputRef.current?.click()}
                                className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg 
                                flex flex-col items-center justify-center cursor-pointer
                                hover:border-gray-400 hover:bg-gray-50 transition-colors"
                            >
                                <Plus className="w-5 h-5 text-gray-400" />
                                <span className="text-xs text-gray-400 mt-1">
                                    {t(translationKey.text.addImage)}
                                </span>
                            </button>

                            {/* Existing Gallery Images */}
                            <AnimatePresence>
                                {visibleExistingGalleryImages.map((img) => (
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
                                            className="absolute top-1 right-1 p-1 bg-black/60 rounded-full 
                                            text-white hover:bg-red-500 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* New Gallery Images */}
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
                                            className="absolute top-1 right-1 p-1 bg-black/60 rounded-full 
                                            text-white hover:bg-red-500 transition-colors"
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

export default EditVisualAssetsSection;
