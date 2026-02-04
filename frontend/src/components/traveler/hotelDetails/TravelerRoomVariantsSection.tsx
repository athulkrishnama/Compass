import { BedDouble, Users, IndianRupee } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import translationKey from "@/utils/i18n/translationKey";
import type { RoomVariantListingItem } from "@/types/api/responses/roomVariantListingResponse";

interface TravelerRoomVariantsSectionProps {
    roomVariants: RoomVariantListingItem[];
}

export default function TravelerRoomVariantsSection({
    roomVariants,
}: TravelerRoomVariantsSectionProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleRoomClick = (roomVariantId: string) => {
        navigate({ to: `/traveler/room/${roomVariantId}` });
    };

    if (roomVariants.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="text-center py-12 text-gray-500">
                    <BedDouble className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{t(translationKey.text.noRoomsAdded)}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 my-8">
            <div className="flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                    {t(translationKey.sections.roomVariants)}
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roomVariants.map((roomVariant, index) => (
                    <motion.div
                        key={roomVariant.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleRoomClick(roomVariant.id)}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer"
                    >
                        <div className="aspect-[16/10] w-full overflow-hidden">
                            <img
                                src={roomVariant.coverImage}
                                alt={roomVariant.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        <div className="p-5">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                {roomVariant.name}
                            </h3>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Users className="w-4 h-4" />
                                    <span className="text-sm">
                                        {t(
                                            translationKey.hotelSearch
                                                .maxGuests,
                                            {
                                                count: roomVariant.maxOccupancy,
                                            }
                                        )}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <span className="flex items-center text-xl font-bold text-gray-900">
                                        <IndianRupee className="w-4 h-4" />
                                        {roomVariant.basePrice.toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {t(translationKey.text.perNight)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
