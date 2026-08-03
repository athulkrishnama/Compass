import { motion } from "framer-motion";
import { IndianRupee } from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface PaymentDetailsCardProps {
    amount: number;
    nights: number;
    numberOfRooms: number;
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1] as const,
        },
    },
};

export default function PaymentDetailsCard({
    amount,
    nights,
    numberOfRooms,
}: PaymentDetailsCardProps) {
    const { t } = useTranslation();
    const pricePerRoom =
        nights > 0 && numberOfRooms > 0
            ? Math.round(amount / numberOfRooms)
            : amount;
    const basePrice = nights > 0 ? Math.round(pricePerRoom / nights) : 0;

    return (
        <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm border border-gray-100"
        >
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">
                {t(translationKey.bookingConfirmation.paymentSummary)}
            </h2>
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                        {t(translationKey.bookingConfirmation.basePrice)}
                    </span>
                    <span className="text-gray-900 font-medium">
                        ₹{basePrice.toLocaleString("en-IN")}{" "}
                        {t(translationKey.bookingConfirmation.perNight)}
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                        {t(translationKey.bookingConfirmation.duration)}
                    </span>
                    <span className="text-gray-900 font-medium">
                        {nights} {t(translationKey.bookingConfirmation.nights)}
                    </span>
                </div>
                {numberOfRooms > 1 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Rooms</span>
                        <span className="text-gray-900 font-medium">
                            {numberOfRooms} rooms × ₹
                            {pricePerRoom.toLocaleString("en-IN")}
                        </span>
                    </div>
                )}
                <div className="flex justify-between text-sm pt-3 sm:pt-4 border-t border-gray-100">
                    <span className="text-gray-500">
                        {t(translationKey.bookingConfirmation.subtotal)}
                    </span>
                    <span className="text-gray-900 font-medium">
                        ₹{amount.toLocaleString("en-IN")}
                    </span>
                </div>
            </div>
            <div className="flex justify-between items-center pt-3 sm:pt-4 border-t border-gray-200">
                <span className="text-gray-700 font-medium">
                    {t(translationKey.bookingConfirmation.totalAmount)}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                    <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" />
                    {amount.toLocaleString("en-IN")}
                </span>
            </div>
        </motion.div>
    );
}
