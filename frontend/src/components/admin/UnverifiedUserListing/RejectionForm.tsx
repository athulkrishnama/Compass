import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import translationKey from "@/utils/i18n/translationKey";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { Ban, X, XCircle } from "lucide-react";
import { useState, type ChangeEvent } from "react";

interface RejectionFormProps {
    handleCancel: () => void;
    handleReject: (reason: string) => void;
}

function RejectionForm({ handleCancel, handleReject }: RejectionFormProps) {
    const { t } = useTranslation();
    const [reason, setReason] = useState("");
    const [isError, setIsError] = useState(false);

    function handleSubmit() {
        if (reason.trim()) {
            handleReject(reason.trim());
            setIsError(false);
        } else {
            setIsError(true);
        }
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setReason(e.target.value);
        if (e.target.value.trim()) {
            setIsError(false);
        } else {
            setIsError(true);
        }
    }
    return (
        <motion.div
            key="reject-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
        >
            <label className="text-sm font-medium">
                {t(translationKey.form.rejectionReason)}
            </label>

            <Input
                value={reason}
                onChange={handleChange}
                placeholder={t(translationKey.form.enterReasonForRejection)}
            />
            <div>
                <AnimatePresence>
                    {isError && (
                        <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.2 }}
                            className="text-sm text-red-500 flex items-center gap-2"
                        >
                            <XCircle className="h-4 w-4" />
                            {t(translationKey.errors.provideRejectionReason)}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex justify-between gap-3">
                <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={handleCancel}
                >
                    <Ban className="w-4 h-4" />
                    {t(translationKey.button.cancel)}
                </Button>

                <Button
                    variant="error"
                    className="flex items-center gap-2"
                    onClick={handleSubmit}
                >
                    <X className="w-4 h-4" />
                    {t(translationKey.button.reject)}
                </Button>
            </div>
        </motion.div>
    );
}

export default RejectionForm;
