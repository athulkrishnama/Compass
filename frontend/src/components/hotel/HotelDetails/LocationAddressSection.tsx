import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { env } from "@/config/env";
import translationKey from "@/utils/i18n/translationKey";

interface LocationAddressSectionProps {
    country: string;
    city: string;
    landMark: string;
    pinCode: string;
    coordinates: [number, number];
}

function LocationAddressSection({
    country,
    city,
    landMark,
    pinCode,
    coordinates,
}: LocationAddressSectionProps) {
    const { t } = useTranslation();
    const [latitude, longitude] = coordinates;

    const fullAddress = `${landMark}, ${pinCode} ${city}, ${country}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
            <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-4 h-4 text-gray-500" />
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {t(translationKey.sections.locationAddress)}
                </h2>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                            {t(translationKey.form.country)}
                        </p>
                        <p className="text-base font-medium text-gray-900">
                            {country}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                            {t(translationKey.form.city)}
                        </p>
                        <p className="text-base font-medium text-gray-900">
                            {city}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                            {t(translationKey.form.landMark)}
                        </p>
                        <p className="text-base font-medium text-gray-900">
                            {landMark}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                            {t(translationKey.form.pincode)}
                        </p>
                        <p className="text-base font-medium text-gray-900">
                            {pinCode}
                        </p>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-50 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
                            {t(translationKey.text.fullAddress)}
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {fullAddress}
                        </p>
                    </div>
                    <div className="md:col-span-1">
                        <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                            {latitude && longitude ? (
                                <img
                                    src={`https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-s+000(${longitude},${latitude})/${longitude},${latitude},14,0/300x300@2x?access_token=${env.VITE_MAPBOX_ACCESS_TOKEN}`}
                                    alt="Map location"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <MapPin className="w-8 h-8" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default LocationAddressSection;
