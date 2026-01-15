import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Image as ImageIcon, Upload, X, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import translationKey from "@/utils/i18n/translationKey";
import Modal from "@/components/shared/modal/Modal";
import ImageCropper from "@/components/shared/ImageCropper/ImageCropper";

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface RoomVisualAssetsSectionProps {
    coverImage: File | null;
    galleryImages: File[];
    onCoverImageChange: (file: File | null) => void;
    onGalleryImagesAdd: (files: File[]) => void;
    onGalleryImageRemove: (index: number) => void;
}

function RoomVisualAssetsSection({
    coverImage,
    galleryImages,
    onCoverImageChange,
    onGalleryImagesAdd,
    onGalleryImageRemove,
}: RoomVisualAssetsSectionProps) {
    const { t } = useTranslation();
    const coverInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);
    const [showCropper, setShowCropper] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

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

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && validateImage(file)) {
            setSelectedImage(file);
            setShowCropper(true);
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

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const validFiles = files.filter((file) => validateImage(file));
        if (validFiles.length > 0) {
            onGalleryImagesAdd(validFiles);
        }
        e.target.value = "";
    };

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
                    {/* Cover Image */}
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
                            onChange={handleCoverChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <div
                            onClick={() => coverInputRef.current?.click()}
                            className="relative aspect-[16/9] rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer overflow-hidden group"
                        >
                            {coverImage ? (
                                <>
                                    <img
                                        src={URL.createObjectURL(coverImage)}
                                        alt="Cover"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onCoverImageChange(null);
                                        }}
                                        className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100"
                                    >
                                        <X className="w-4 h-4" />
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

                    {/* Gallery Images */}
                    <div className="space-y-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wider">
                            {t(translationKey.form.galleryImages)}
                        </span>
                        <input
                            type="file"
                            ref={galleryInputRef}
                            onChange={handleGalleryChange}
                            accept="image/*"
                            multiple
                            className="hidden"
                        />
                        <div className="grid grid-cols-4 gap-3">
                            <div
                                onClick={() => galleryInputRef.current?.click()}
                                className="aspect-square rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center"
                            >
                                <Plus className="w-6 h-6 text-gray-400" />
                            </div>
                            {galleryImages.map((img, index) => (
                                <div
                                    key={index}
                                    className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group"
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
                                        className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            {/* Empty placeholders */}
                            {Array.from({
                                length: Math.max(0, 3 - galleryImages.length),
                            }).map((_, i) => (
                                <div
                                    key={`empty-${i}`}
                                    className="aspect-square rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center"
                                >
                                    <ImageIcon className="w-6 h-6 text-gray-300" />
                                </div>
                            ))}
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

export default RoomVisualAssetsSection;
