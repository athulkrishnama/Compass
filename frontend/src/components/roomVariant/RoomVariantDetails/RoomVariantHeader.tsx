import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import type { IRoomVariantDetailResponse } from "@/types/api/responses/roomVariantDetailResponse";
import { Users, Bed } from "lucide-react";

import { BED_TYPE_WITH_TRANSLATION } from "@/constants/roomConstants/bedTypeWithTranslation";

interface RoomVariantHeaderProps {
    roomVariant: IRoomVariantDetailResponse;
}

export default function RoomVariantHeader({
    roomVariant,
}: RoomVariantHeaderProps) {
    const { t } = useTranslation();

    const getBedTypeName = (type: string) => {
        const config = BED_TYPE_WITH_TRANSLATION.find((b) => b.value === type);
        return config ? t(config.labelKey) : type;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex flex-col md:flex-row">
                <div className="relative w-full md:w-80 h-56 md:h-auto bg-gray-200 shrink-0">
                    <img
                        src={roomVariant.coverImage}
                        alt={roomVariant.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4">
                        <span className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md">
                            {roomVariant.name}
                        </span>
                    </div>
                </div>

                <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-3">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {roomVariant.name}
                            </h1>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-gray-900">
                                    ₹{roomVariant.basePrice.toFixed(2)}
                                </span>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">
                                    {t(translationKey.text.perNight)}
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            {roomVariant.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                                {t(translationKey.text.maxOccupancy)}
                            </p>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-900">
                                    {roomVariant.maxOccupancy}
                                </span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                                {t(translationKey.text.bedding)}
                            </p>
                            <div className="flex items-center gap-2">
                                <Bed className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-900">
                                    {roomVariant.bedConfig.count}{" "}
                                    {getBedTypeName(roomVariant.bedConfig.type)}
                                </span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                                {t(translationKey.text.variantId)}
                            </p>
                            <span className="text-sm font-medium text-gray-900">
                                {roomVariant.id.slice(-6).toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
