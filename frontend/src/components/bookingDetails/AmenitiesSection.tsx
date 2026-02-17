import { motion } from "framer-motion";
import { Wifi } from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import { getAmenityDetails } from "@/constants/roomConstants/roomAmenityWithIconAndTranslation";
import { LayoutGrid } from "lucide-react";

interface AmenitiesSectionProps {
    amenities: string[];
}

export function AmenitiesSection({ amenities }: AmenitiesSectionProps) {
    const { t } = useTranslation();

    if (amenities.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="rounded-2xl border border-border bg-background p-5 flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-300"
        >
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-foreground">
                    {t(translationKey.bookingDetails.amenitiesIncluded)}
                </h3>
                <LayoutGrid className="w-4 h-4 text-muted-foreground" />
            </div>

            <div className="grid grid-cols-2 gap-3">
                {amenities.slice(0, 5).map((amenity) => {
                    const amenityDetails = getAmenityDetails(amenity);
                    const Icon = amenityDetails?.icon || Wifi;
                    const label = amenityDetails
                        ? t(amenityDetails.labelKey)
                        : amenity.replace(/_/g, " ");

                    return (
                        <div
                            key={amenity}
                            className="flex items-center gap-2.5 text-sm text-foreground/80"
                        >
                            <Icon className="w-4 h-4 text-foreground/50 flex-shrink-0" />
                            <span className="truncate">{label}</span>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
