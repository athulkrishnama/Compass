import translationKey from "@/utils/i18n/translationKey";
import { useTranslation } from "react-i18next";
import OTP from "../OTP/OTP";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { createForgetPasswordVerifyOtpQueryOptions } from "@/queryOptions/authQueryOptions";
import { toast } from "sonner";

type propType = {
    email: string;
    onComplete: (token: string) => void;
};

function Stage2({ email, onComplete }: propType) {
    const { t } = useTranslation();
    const rootRef = useRef<(HTMLInputElement | null)[]>([]);
    const intervalRef = useRef<number | null>(null);
    const [time, setTime] = useState(5 * 60);

    const { mutate, isPending } = useMutation(
        createForgetPasswordVerifyOtpQueryOptions()
    );

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

        mutate(
            { email, otp },
            {
                onSuccess: (res) => {
                    toast.success(res.message);
                    onComplete(res.data?.token!);
                },
                onError: (err) => {
                    toast.error(err.message);
                },
            }
        );
    }

    useEffect(() => {
        if (!intervalRef.current) {
            intervalRef.current = setInterval(() => {
                setTime((prev) => {
                    if (prev > 0) {
                        return prev - 1;
                    } else {
                        if (intervalRef.current)
                            clearInterval(intervalRef.current);
                        return 0;
                    }
                });
            }, 1000);
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center bg-white p-8 rounded-2xl  space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">
                {t(translationKey.headings.enterOtp)}
            </h2>

            <div className="my-4">
                <OTP
                    count={6}
                    disabled={time === 0}
                    rootRef={rootRef}
                    handleComplete={handleSubmit}
                />
            </div>

            <p className="text-gray-700 font-mono text-lg tracking-wider">
                {`${(Math.floor(time / 60) + "").padStart(2, "0")} : ${(
                    Math.floor(time % 60) + ""
                ).padStart(2, "0")}`}
            </p>

            <Button
                onClick={handleSubmit}
                disabled={time === 0 || isPending}
                className="w-full max-w-xs py-3 text-lg font-semibold rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {t(translationKey.button.verify)}
            </Button>
        </div>
    );
}

export default Stage2;
