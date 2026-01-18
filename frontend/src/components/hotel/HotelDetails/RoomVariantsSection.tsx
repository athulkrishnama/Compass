import { Link } from "@tanstack/react-router";
import { BedDouble, Pencil, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import type { RoomVariantListingItem } from "@/types/api/responses/roomVariantListingResponse";

interface RoomVariantsSectionProps {
    hotelId: string;
    roomVariants: RoomVariantListingItem[];
}

export default function RoomVariantsSection({
    hotelId,
    roomVariants,
}: RoomVariantsSectionProps) {
    const { t } = useTranslation();

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <BedDouble className="w-4 h-4 text-gray-500" />
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {t(translationKey.sections.roomVariants)}
                    </h2>
                </div>
                <Link
                    to="/hotel/hotels/$hotelId/room-variants/add"
                    params={{ hotelId }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-900 transition-colors"
                >
                    <Plus className="w-3 h-3" />
                    {t(translationKey.button.addRoomVariant)}
                </Link>
            </div>

            <div className="space-y-4">
                {roomVariants.map((roomVariant) => (
                    <div
                        key={roomVariant.id}
                        className="flex items-center gap-6 p-4 rounded-xl hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-100"
                    >
                        <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                            <img
                                src={roomVariant.coverImage}
                                alt={roomVariant.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1 items-center">
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                                    {t(translationKey.form.roomName)}
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                    {roomVariant.name}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                                    {t(translationKey.form.roomCode)}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {roomVariant.code}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                                    {t(translationKey.text.basePrice)}
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                    ₹{roomVariant.basePrice.toFixed(2)}{" "}
                                    <span className="text-gray-400 font-normal">
                                        {t(translationKey.text.perNight)}
                                    </span>
                                </p>
                            </div>
                            <div className="flex justify-end">
                                <Link
                                    to="/hotel/hotels/$hotelId/room-variants/$roomVariantId/edit"
                                    params={{
                                        hotelId: hotelId,
                                        roomVariantId: roomVariant.id,
                                    }}
                                    className="flex items-center gap-2 text-[10px] font-medium text-gray-700 hover:text-gray-900 uppercase tracking-wider transition-colors"
                                >
                                    <Pencil className="w-3 h-3" />
                                    {t(translationKey.button.edit)}
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
                {roomVariants.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p>{t(translationKey.text.noRoomsAdded)}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
