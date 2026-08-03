import { motion } from "framer-motion";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface ReviewWelcomeStepProps {
    hotelName: string;
    hotelCity: string;
    checkInDate: string;
    checkOutDate: string;
    coverImage?: string;
    onStart: () => void;
}

export function ReviewWelcomeStep({
    hotelName,
    hotelCity,
    checkInDate,
    checkOutDate,
    coverImage,
    onStart,
}: ReviewWelcomeStepProps) {
    const { t } = useTranslation();
    const nights = Math.round(
        (parseISO(checkOutDate).getTime() - parseISO(checkInDate).getTime()) /
            (1000 * 60 * 60 * 24)
    );

    return (
        <motion.div
            className="flex flex-col h-full"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
        >
            {/* Hotel image */}
            {coverImage && (
                <div className="relative h-40 w-full overflow-hidden rounded-2xl mb-6 flex-shrink-0">
                    <img
                        src={coverImage}
                        alt={hotelName}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
            )}

            <div className="flex-1">
                <h2 className="text-3xl font-black text-black leading-tight mb-2">
                    {t(translationKey.hotelReviewModal.welcomeTitle)}
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                    {t(translationKey.hotelReviewModal.welcomeDescription)}
                </p>

                <div className="space-y-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-black text-sm">
                                {hotelName}
                            </p>
                            <p className="text-gray-400 text-xs">{hotelCity}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-black text-sm">
                                {format(parseISO(checkInDate), "MMM d")} –{" "}
                                {format(parseISO(checkOutDate), "MMM d, yyyy")}
                            </p>
                            <p className="text-gray-400 text-xs">
                                {nights}{" "}
                                {nights === 1
                                    ? t(translationKey.hotelReviewModal.night)
                                    : t(translationKey.hotelReviewModal.nights)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Button
                onClick={onStart}
                className="w-full mt-6 h-12 rounded-2xl bg-black text-white font-bold text-sm hover:bg-black/90 flex items-center justify-center gap-2"
            >
                {t(translationKey.hotelReviewModal.startReview)}
                <ArrowRight className="w-4 h-4" />
            </Button>
        </motion.div>
    );
}
