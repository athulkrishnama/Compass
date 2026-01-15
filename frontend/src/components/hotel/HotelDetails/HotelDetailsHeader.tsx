import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import translationKey from "@/utils/i18n/translationKey";
import type { IGetHotelByIdResponse } from "@/types/api/responses/getHotelById";

interface HotelDetailsHeaderProps {
    hotelData: IGetHotelByIdResponse;
}

function HotelDetailsHeader({ hotelData }: HotelDetailsHeaderProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleBack = () => {
        navigate({ to: "/hotel/hotels" });
    };

    return (
        <div className="sticky top-0 z-50 bg-white border-b border-gray-100">
            <div className="max-w-6xl mx-auto px-6 py-4">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">
                            {hotelData.name}
                        </h1>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                            {t(translationKey.text.propertyId)}: #
                            {hotelData.id.slice(-8).toUpperCase()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HotelDetailsHeader;
