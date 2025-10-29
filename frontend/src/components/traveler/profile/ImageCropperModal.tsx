import ImageCropper from "@/components/shared/ImageCropper/ImageCropper";
import Modal from "@/components/shared/modal/Modal";

interface ImageCropperModalProps {
    isOpen: boolean;
    handleClose: (image?: File) => void;
    image: File;
}

function ImageCropperModal({
    handleClose,
    isOpen,
    image,
}: ImageCropperModalProps) {
    return (
        <Modal handleClose={handleClose} isOpen={isOpen}>
            <ImageCropper
                image={image}
                ratio={1}
                onCropComplete={handleClose}
            />
        </Modal>
    );
}

export default ImageCropperModal;
