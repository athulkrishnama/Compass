import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Image as ImageIcon, Upload, X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Modal from "@/components/shared/modal/Modal";
import ImageCropper from "@/components/shared/ImageCropper/ImageCropper";
import translationKey from "@/utils/i18n/translationKey";

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface EditRoomVisualAssetsSectionProps {
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

function EditRoomVisualAssetsSection({
    existingCoverImage,
    existingGalleryImages,
    newCoverImage,
    newGalleryImages,
    onNewCoverImageChange,
    onNewGalleryImagesAdd,
    onNewGalleryImageRemove,
    onExistingGalleryImageDelete,
    deletedGalleryImageIndexes,
}: EditRoomVisualAssetsSectionProps) {
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
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
                <div className="flex items-center gap-2 mb-6">
                    <ImageIcon className="w-4 h-4 text-gray-500" />
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {t(translationKey.sections.visualAssets)}
                    </h2>
                </div>

                <div className="space-y-6">
                    {/* Cover Image Section */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500 uppercase tracking-wider">
                                {t(translationKey.form.coverImage)}
                            </span>
                            <span className="text-xs text-gray-400">
                                {t(translationKey.text.coverImageRequirements)}
                            </span>
                        </div>
                        <input
                            type="file"
                            ref={coverInputRef}
                            onChange={handleCoverImageSelect}
                            accept="image/*"
                            className="hidden"
                        />
                        <div
                            onClick={() => coverInputRef.current?.click()}
                            className="relative aspect-[16/9] rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer overflow-hidden group"
                        >
                            {displayCoverImage ? (
                                <>
                                    <img
                                        src={displayCoverImage}
                                        alt="Cover"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            coverInputRef.current?.click();
                                        }}
                                        className="absolute bottom-2 right-2 px-3 py-1.5 bg-white/90 hover:bg-white rounded-lg text-sm font-medium text-gray-700 shadow-sm transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        {t(translationKey.button.changeImage)}
                                    </button>
                                </>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                    <Upload className="w-8 h-8 mb-2" />
                                    <span className="text-sm font-medium">
                                        {t(
                                            translationKey.text
                                                .clickToUploadCover
                                        )}
                                    </span>
                                    <span className="text-xs text-gray-400 mt-1">
                                        PNG, JPG up to 10MB
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Gallery Images Section */}
                    <div className="space-y-3">
                        <span className="text-xs text-gray-500 uppercase tracking-wider">
                            {t(translationKey.form.galleryImages)}
                        </span>
                        <input
                            type="file"
                            ref={galleryInputRef}
                            onChange={handleGalleryImageSelect}
                            accept="image/*"
                            multiple
                            className="hidden"
                        />

                        {/* Existing Images */}
                        {visibleExistingGalleryImages.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs text-gray-500">
                                    {t(translationKey.text.existingImages)}
                                </p>
                                <div className="grid grid-cols-4 gap-3">
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
                                                    className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group"
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
                                                        className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
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

                        {/* New Images */}
                        <div className="space-y-2">
                            {newGalleryImageItems.length > 0 && (
                                <p className="text-xs text-gray-500">
                                    {t(translationKey.text.newImages)}
                                </p>
                            )}
                            <div className="grid grid-cols-4 gap-3">
                                <div
                                    onClick={() =>
                                        galleryInputRef.current?.click()
                                    }
                                    className="aspect-square rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer flex flex-col items-center justify-center"
                                >
                                    <Plus className="w-6 h-6 text-gray-400" />
                                    <span className="text-xs text-gray-400 mt-1">
                                        {t(translationKey.button.addImage)}
                                    </span>
                                </div>

                                <AnimatePresence>
                                    {newGalleryImageItems.map((img) => (
                                        <motion.div
                                            key={`new-${img.index}`}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group"
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
                                                className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
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
            </motion.div>

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

export default EditRoomVisualAssetsSection;
