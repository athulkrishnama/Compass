import { motion } from "framer-motion";
import { Clock, MapPin, Calendar, Accessibility } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import translationKey from "@/utils/i18n/translationKey";
import type { WEEKDAY } from "@/constants/destinationConstants/weekdays";

interface DestinationInfoProps {
    entryFee?: number;
    isFree: boolean;
    isAlwaysOpen: boolean;
    openingTime?: string;
    closingTime?: string;
    closedDays?: WEEKDAY[];
    city: string;
    country: string;
    isWheelChairAccessible: boolean;
}

function DestinationInfo({
    entryFee,
    isFree,
    isAlwaysOpen,
    openingTime,
    closingTime,
    closedDays,
    city,
    country,
    isWheelChairAccessible,
}: DestinationInfoProps) {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="sticky top-24"
        >
            <Card className="p-6 bg-white border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                            {t(translationKey.destinationDetail.entryFee)}
                        </p>
                        {isFree ? (
                            <Badge className="bg-green-100 text-green-700 border-0 text-lg font-bold px-3 py-1">
                                {t(translationKey.text.free)}
                            </Badge>
                        ) : (
                            <p className="text-3xl font-bold text-gray-900">
                                ₹{entryFee}
                                <span className="text-sm font-normal text-gray-500 ml-1">
                                    /{t(translationKey.destinationDetail.day)}
                                </span>
                            </p>
                        )}
                    </div>
                    <div className="p-3 bg-gray-900 rounded-xl">
                        <Calendar className="w-5 h-5 text-white" />
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <Clock className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                {t(
                                    translationKey.destinationDetail
                                        .visitingHours
                                )}
                            </p>
                            {isAlwaysOpen ? (
                                <p className="text-sm font-semibold text-gray-900">
                                    {t(
                                        translationKey.destinationDetail
                                            .open24Hours
                                    )}
                                </p>
                            ) : (
                                <p className="text-sm font-semibold text-gray-900">
                                    {openingTime} - {closingTime}
                                </p>
                            )}
                            {!isAlwaysOpen && (
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {t(
                                        translationKey.destinationDetail
                                            .bestVisitBetween
                                    )}
                                </p>
                            )}
                        </div>
                    </div>

                    {closedDays && closedDays.length > 0 && (
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <Calendar className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                    {t(
                                        translationKey.destinationDetail
                                            .closedDays
                                    )}
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {closedDays.length > 0
                                        ? closedDays
                                              .map((day) =>
                                                  t(
                                                      translationKey.weekdays[
                                                          day
                                                      ]
                                                  )
                                              )
                                              .join(", ")
                                        : t(
                                              translationKey.destinationDetail
                                                  .none
                                          )}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <MapPin className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                {t(translationKey.destinationDetail.location)}
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                                {city}, {country}
                            </p>
                        </div>
                    </div>

                    {isWheelChairAccessible && (
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Accessibility className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-green-700">
                                    {t(
                                        translationKey.destinationDetail
                                            .wheelchairAccessible
                                    )}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </motion.div>
    );
}

export default DestinationInfo;
