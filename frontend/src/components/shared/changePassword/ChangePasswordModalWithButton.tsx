import { Button } from "@/components/ui/button";
import translationKey from "@/utils/i18n/translationKey";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ChangePasswordModal from "./ChangePasswordModal";
import { LockKeyhole } from "lucide-react";

interface ChangePasswordModalWithButtonProps {
    className?: string;
}
function ChangePasswordModalWithButton({
    className,
}: ChangePasswordModalWithButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();

    function handleClose() {
        setIsOpen(false);
    }

    function handleOpenModal() {
        setIsOpen(true);
    }
    return (
        <>
            <ChangePasswordModal isOpen={isOpen} handleClose={handleClose} />
            <Button className={className} onClick={handleOpenModal}>
                <LockKeyhole />
                {t(translationKey.button.changePassword)}
            </Button>
        </>
    );
}

export default ChangePasswordModalWithButton;
