import {
    useEffect,
    useRef,
    useState,
    type Dispatch,
    type SetStateAction,
} from "react";
import Modal from "../modal/Modal";
import OTP from "../OTP/OTP";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import { toast } from "sonner";

interface propType {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    handleVerify: (otp: string) => void;
    handleResendOtp: () => Promise<void>;
}
function OtpModal({
    isOpen,
    setIsOpen,
    handleVerify,
    handleResendOtp,
}: propType) {
    const rootRef = useRef<(HTMLInputElement | null)[]>([]);
    const intervalRef = useRef<number | null>(null);
    const [time, setTime] = useState(0);

    const { t } = useTranslation();

    function handleClose() {
        setIsOpen(false);
    }

    function handleSubmit() {
        const index = rootRef.current.findIndex((ref) => {
            if (ref) {
                if (Number(ref.value) < 0 || Number(ref.value) > 9) return true;
            }
        });

        if (index !== -1) {
            rootRef.current[index]?.focus();
        }
        const otp = rootRef.current
            .map((ref) => (ref ? ref.value : ""))
            .join("");
        if (otp.length !== 6) return;
        handleVerify(otp);
    }

    async function handleResend() {
        try {
            if (intervalRef.current) clearInterval(intervalRef.current);
            await handleResendOtp();
            setTime(1 * 60);
            intervalRef.current = setInterval(() => {
                setTime((prev) => {
                    if (prev >= 1) {
                        return prev - 1;
                    } else if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                    return 0;
                });
            }, 1000);
        } catch (error) {
            if (error instanceof Error) toast.error(error.message);
        }
    }

    useEffect(() => {
        if (isOpen) {
            setTime(60);
            intervalRef.current = setInterval(() => {
                setTime((prev) => {
                    if (prev >= 1) {
                        return prev - 1;
                    } else if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                    return 0;
                });
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} handleClose={handleClose}>
            <div className="flex flex-col items-center justify-center text-center space-y-6 p-6">
                <h4 className="text-2xl font-semibold text-gray-800">
                    {t(translationKey.headings.enterOtp)}
                </h4>

                <p className="text-gray-600 text-sm">
                    {t(translationKey.headings.otpHasSentToYourEmail)}
                </p>

                <div className="my-4">
                    <OTP
                        count={6}
                        handleComplete={handleSubmit}
                        disabled={time <= 0}
                        rootRef={rootRef}
                    />
                </div>

                <p className="text-gray-700 font-mono text-lg tracking-wider">
                    {`${(Math.floor(time / 60) + "").padStart(2, "0")}:${(
                        (time % 60) +
                        ""
                    ).padStart(2, "0")}`}
                </p>

                <div className="flex items-center justify-center space-x-4 mt-2">
                    <Button
                        variant="link"
                        onClick={handleResend}
                        disabled={time > 0}
                        className="text-gray-700 hover:text-gray-900 hover:underline"
                    >
                        {t(translationKey.button.resend)}
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200"
                    >
                        {t(translationKey.button.verify)}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default OtpModal;
