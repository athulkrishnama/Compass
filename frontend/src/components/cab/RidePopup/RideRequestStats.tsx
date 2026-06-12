import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import { Clock, DollarSign } from "lucide-react";

interface StatsProps {
    time: number;
    fare: number;
}

export function RideRequestStats({ time, fare }: StatsProps) {
    const { t } = useTranslation();
    return (
        <div className="mx-5 mb-5 grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-2xl p-3">
                <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wide">
                        {t(translationKey.fareSummary.estTime)}
                    </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                    {time ? Math.round(time / 60) : 0}
                    <span className="text-sm font-medium text-gray-500 ml-1">
                        {t(translationKey.fareSummary.min)}
                    </span>
                </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-3">
                <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium uppercase tracking-wide">
                        {t(translationKey.rideRequestPopup.earnings)}
                    </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">₹{fare}</p>
            </div>
        </div>
    );
}
