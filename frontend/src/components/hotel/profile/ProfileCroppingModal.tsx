import ImageCropper from "@/components/shared/ImageCropper/ImageCropper";
import Modal from "@/components/shared/modal/Modal";

interface ProfileCroppingModalProps {
    isOpen: boolean;
    handleClose: (image?: File) => void;
    image: File;
}

function ProfileCroppingModal({
    handleClose,
    isOpen,
    image,
}: ProfileCroppingModalProps) {
    return (
        <Modal handleClose={handleClose} isOpen={isOpen}>
            <ImageCropper
                image={image}
                onCropComplete={handleClose}
                ratio={1}
            />
        </Modal>
    );
}

export default ProfileCroppingModal;
