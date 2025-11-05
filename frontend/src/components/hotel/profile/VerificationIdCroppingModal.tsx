import ImageCropper from "@/components/shared/ImageCropper/ImageCropper";
import Modal from "@/components/shared/modal/Modal";

interface VerficationIdCroppingModalProps {
    isOpen: boolean;
    handleClose: (image?: File) => void;
    image: File;
}

function VerficationIdCroppingModal({
    handleClose,
    isOpen,
    image,
}: VerficationIdCroppingModalProps) {
    return (
        <Modal handleClose={handleClose} isOpen={isOpen}>
            <ImageCropper image={image} onCropComplete={handleClose} />
        </Modal>
    );
}

export default VerficationIdCroppingModal;
