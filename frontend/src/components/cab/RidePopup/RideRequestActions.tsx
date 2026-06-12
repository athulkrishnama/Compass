import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface ActionButtonsProps {
    onDecline: () => void;
    onAccept: () => void;
}

export function RideRequestActions({
    onDecline,
    onAccept,
}: ActionButtonsProps) {
    const { t } = useTranslation();
    return (
        <div className="px-5 pb-7 grid grid-cols-2 gap-3">
            <button
                onClick={onDecline}
                className="py-3.5 rounded-2xl border border-red-200 text-red-500 font-semibold text-sm hover:bg-red-50 active:scale-95 transition-all"
            >
                {t(translationKey.rideRequestPopup.decline)}
            </button>
            <button
                onClick={onAccept}
                className="py-3.5 rounded-2xl bg-gray-900 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-700 active:scale-95 transition-all"
            >
                {t(translationKey.rideRequestPopup.acceptRide)}
                <span className="text-base">→</span>
            </button>
        </div>
    );
}
