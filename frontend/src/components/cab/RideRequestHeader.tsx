import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import { X } from "lucide-react";

interface HeaderProps {
    timeLeft: number;
    onDecline: () => void;
}

export function RideRequestHeader({ timeLeft, onDecline }: HeaderProps) {
    const { t } = useTranslation();
    return (
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                    {t(translationKey.rideRequestPopup.newRideRequest)}
                    <span className="ml-2 text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full text-[10px] font-bold animate-pulse">
                        {t(translationKey.rideRequestPopup.timeLeft, {
                            timeLeft,
                        })}
                    </span>
                </p>
                <h2 className="text-lg font-bold text-gray-900 mt-0.5">
                    {t(translationKey.rideRequestPopup.rideDetails)}
                </h2>
            </div>
            <button
                onClick={onDecline}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
                <X className="w-4 h-4 text-gray-600" />
            </button>
        </div>
    );
}
