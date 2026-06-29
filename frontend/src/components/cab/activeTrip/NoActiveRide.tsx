import React from "react";
import { useTranslation } from "react-i18next";
import TRANSLATION_KEYS from "@/utils/i18n/translationKey";

export const NoActiveRide: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="w-full h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {t(TRANSLATION_KEYS.activeTrip.noActiveRideTitle)}
                </h3>
                <p className="text-gray-500">
                    {t(TRANSLATION_KEYS.activeTrip.noActiveRideDescription)}
                </p>
            </div>
        </div>
    );
};
