import { motion } from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import { env } from "@/config/env";
import { type IGetHotelByIdResponse } from "@/types/api/responses/getHotelById";

interface HotelInfoCardProps {
    hotel: IGetHotelByIdResponse;
}

export default function HotelInfoCard({ hotel }: HotelInfoCardProps) {
    const { t } = useTranslation();

    const fullAddress = `${hotel.landMark}, ${hotel.city}, ${hotel.country} - ${hotel.pinCode}`;
    const [lat, lng] = hotel.coordinates;

    const handleOpenInMaps = () => {
        if (hotel.coordinates) {
            window.open(
                `https://www.google.com/maps?q=${lat},${lng}`,
                "_blank"
            );
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t(translationKey.roomDetails.aboutTheHotel)}
            </h2>

            <div className="space-y-4">
                <div className="flex gap-4">
                    <img
                        src={hotel.coverImage}
                        alt={hotel.name}
                        className="w-24 h-24 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                            {hotel.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                            {hotel.description}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">
                            {t(translationKey.roomDetails.address)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            {fullAddress}
                        </p>
                    </div>
                    <button
                        onClick={handleOpenInMaps}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Open in Maps"
                    >
                        <ExternalLink className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                {hotel.coordinates && (
                    <div className="h-48 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                        {env.VITE_MAPBOX_ACCESS_TOKEN ? (
                            <img
                                src={`https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-s+000(${lng},${lat})/${lng},${lat},14,0/600x400@2x?access_token=${env.VITE_MAPBOX_ACCESS_TOKEN}`}
                                alt="Map location"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <MapPin className="w-8 h-8" />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
