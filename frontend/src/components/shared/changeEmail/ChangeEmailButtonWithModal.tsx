import { Button } from "@/components/ui/button";
import { AnimatePresence } from "framer-motion";
import { Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import Modal from "../modal/Modal";
import NewEmailStep from "./NewEmailStep";
import RequestOtpStep from "./RequestOtpStep";
import StepIndicator from "./StepIndicator";
import VerifyOtpStep from "./VerifyOtpStep";
import { useChangeEmail } from "../../../hooks/useChangeEmail";
import { motion } from "framer-motion";

interface ChangeEmailButtonWithModalProps {
    className?: string;
}

function ChangeEmailButtonWithModal({
    className,
}: ChangeEmailButtonWithModalProps) {
    const { t } = useTranslation();
    const {
        isOpen,
        step,
        currentEmail,
        otpInputRefs,
        form,
        isRequestingOtp,
        isVerifyingOtp,
        isSubmittingEmail,
        handleOpen,
        handleClose,
        handleRequestOtp,
        handleResendOtp,
        handleOtpComplete,
        handleSubmitNewEmail,
    } = useChangeEmail();

    return (
        <>
            <Modal handleClose={handleClose} isOpen={isOpen}>
                <div className="w-full max-w-md mx-auto bg-white p-1">
                    <StepIndicator currentStep={step} />

                    <AnimatePresence mode="wait">
                        {step === "requestOtp" && (
                            <RequestOtpStep
                                currentEmail={currentEmail}
                                isLoading={isRequestingOtp}
                                onRequestOtp={handleRequestOtp}
                            />
                        )}

                        {step === "verifyOtp" && (
                            <VerifyOtpStep
                                isLoading={isVerifyingOtp}
                                isResending={isRequestingOtp}
                                otpInputRefs={otpInputRefs}
                                onOtpComplete={handleOtpComplete}
                                onResendOtp={handleResendOtp}
                            />
                        )}

                        {step === "newEmail" && (
                            <NewEmailStep
                                form={form}
                                isLoading={isSubmittingEmail}
                                onSubmit={handleSubmitNewEmail}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </Modal>
            <motion.div
                whileHover={{ x: -2 }}
                whileTap={{ x: 2 }}
                className="w-fit"
            >
                <Button
                    variant="secondary"
                    size="sm"
                    className={`rounded-full ${className}`}
                    onClick={handleOpen}
                >
                    <Mail className="mr-2 h-4 w-4" />
                    {t(translationKey.headings.changeEmail)}
                </Button>
            </motion.div>
        </>
    );
}

export default ChangeEmailButtonWithModal;
