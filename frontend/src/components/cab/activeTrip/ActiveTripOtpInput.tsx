import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import OTP from "@/components/shared/OTP/OTP";

interface ActiveTripOtpInputProps {
    value: string;
    onChange: (val: string) => void;
    length?: number;
}

export function ActiveTripOtpInput({
    value,
    onChange,
    length = 4,
}: ActiveTripOtpInputProps) {
    const { t } = useTranslation();
    const rootRef = useRef<(HTMLInputElement | null)[]>(
        new Array(length).fill(null)
    );

    const handleSyncValue = () => {
        const currentOtp = rootRef.current
            .map((ref) => (ref ? ref.value : ""))
            .join("");
        onChange(currentOtp);
    };

    useEffect(() => {
        if (!value) {
            rootRef.current.forEach((input) => {
                if (input) input.value = "";
            });
        }
    }, [value]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-4"
        >
            <p className="text-sm font-semibold text-gray-900 mb-1">
                {t(translationKey.activeTrip.enterOtp)}
            </p>
            <p className="text-xs text-gray-400 mb-3">
                {t(translationKey.activeTrip.otpDescription)}
            </p>

            <div
                className="flex justify-center"
                onKeyUp={handleSyncValue}
                onChange={handleSyncValue}
                onPaste={() => setTimeout(handleSyncValue, 50)}
            >
                <OTP
                    count={length}
                    handleComplete={handleSyncValue}
                    disabled={false}
                    rootRef={rootRef}
                />
            </div>
        </motion.div>
    );
}
