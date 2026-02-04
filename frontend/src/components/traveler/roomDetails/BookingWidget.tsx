import { useState } from "react";
import { motion } from "framer-motion";
import {
    IndianRupee,
    CalendarDays,
    Users,
    Info,
    Plus,
    Minus,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import { Button } from "@/components/ui/button";

interface BookingWidgetProps {
    basePrice: number;
    maxOccupancy: number;
}

export default function BookingWidget({
    basePrice,
    maxOccupancy,
}: BookingWidgetProps) {
    const { t } = useTranslation();
    const [guestCount, setGuestCount] = useState(1);

    const nights = 2;
    const total = basePrice * nights;

    const handleIncrementGuests = () => {
        if (guestCount < maxOccupancy) {
            setGuestCount(guestCount + 1);
        }
    };

    const handleDecrementGuests = () => {
        if (guestCount > 1) {
            setGuestCount(guestCount - 1);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="sticky top-6"
        >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-baseline gap-2 mb-6">
                    <div className="flex items-center">
                        <IndianRupee className="w-6 h-6 text-gray-900" />
                        <span className="text-3xl font-bold text-gray-900">
                            {basePrice.toLocaleString("en-IN")}
                        </span>
                    </div>
                    <span className="text-gray-500">
                        / {t(translationKey.roomDetails.night)}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors cursor-pointer">
                        <div className="flex items-center gap-2 text-gray-500">
                            <CalendarDays className="w-4 h-4" />
                            <span className="text-xs uppercase font-medium">
                                {t(translationKey.hotelSearch.checkIn)}
                            </span>
                        </div>
                        <p className="text-sm font-medium text-gray-400 mt-1">
                            {t(translationKey.roomDetails.selectDate)}
                        </p>
                    </div>
                    <div className="p-3 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors cursor-pointer">
                        <div className="flex items-center gap-2 text-gray-500">
                            <CalendarDays className="w-4 h-4" />
                            <span className="text-xs uppercase font-medium">
                                {t(translationKey.hotelSearch.checkOut)}
                            </span>
                        </div>
                        <p className="text-sm font-medium text-gray-400 mt-1">
                            {t(translationKey.roomDetails.selectDate)}
                        </p>
                    </div>
                </div>

                <div className="p-3 border border-gray-200 rounded-xl mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-700">
                            <Users className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                {t(translationKey.hotelSearch.guests)}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleDecrementGuests}
                                disabled={guestCount <= 1}
                                className="p-1.5 rounded-full border border-gray-300 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <Minus className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="text-lg font-semibold text-gray-900 w-6 text-center">
                                {guestCount}
                            </span>
                            <button
                                onClick={handleIncrementGuests}
                                disabled={guestCount >= maxOccupancy}
                                className="p-1.5 rounded-full border border-gray-300 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <Plus className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        {t(translationKey.hotelSearch.maxGuests, {
                            count: maxOccupancy,
                        })}
                    </p>
                </div>

                <Button className="w-full h-12 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-medium rounded-xl shadow-lg">
                    {t(translationKey.roomDetails.bookYourStay)}
                </Button>

                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>{t(translationKey.roomDetails.noExtraCharges)}</span>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                            {t(translationKey.roomDetails.baseNights, {
                                price: `₹${basePrice.toLocaleString("en-IN")}`,
                                nights: nights,
                            })}
                        </span>
                        <span className="flex items-center text-gray-900">
                            <IndianRupee className="w-3 h-3" />
                            {(basePrice * nights).toLocaleString("en-IN")}
                        </span>
                    </div>
                    <div className="flex justify-between font-semibold pt-3 border-t border-gray-100">
                        <span className="text-gray-900">
                            {t(translationKey.roomDetails.total)}
                        </span>
                        <span className="flex items-center text-gray-900">
                            <IndianRupee className="w-4 h-4" />
                            {total.toLocaleString("en-IN")}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
