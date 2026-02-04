import { motion } from "framer-motion";
import { Clock, XCircle, CheckCircle, Cigarette, PawPrint } from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface RoomPoliciesProps {
    policies: {
        smokingAllowed: boolean;
        petsAllowed: boolean;
        checkInTime: string;
        checkOutTime: string;
    };
}

export default function RoomPolicies({ policies }: RoomPoliciesProps) {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t(translationKey.roomDetails.policiesAndRules)}
            </h2>

            <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Clock className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">
                            {t(translationKey.roomDetails.checkInCheckOut)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            {t(translationKey.hotelSearch.checkIn)}:{" "}
                            {policies.checkInTime} •{" "}
                            {t(translationKey.hotelSearch.checkOut)}:{" "}
                            {policies.checkOutTime}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                        <XCircle className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">
                            {t(translationKey.roomDetails.cancellation)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            {t(translationKey.roomDetails.cancellationPolicy)}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Cigarette className="w-5 h-5 text-gray-700" />
                        </div>
                        <div className="flex items-center gap-2">
                            {policies.smokingAllowed ? (
                                <>
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-sm font-medium text-gray-700">
                                        {t(
                                            translationKey.roomDetails
                                                .smokingAllowed
                                        )}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-4 h-4 text-red-500" />
                                    <span className="text-sm font-medium text-gray-700">
                                        {t(
                                            translationKey.roomDetails
                                                .smokingNotAllowed
                                        )}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                            <PawPrint className="w-5 h-5 text-gray-700" />
                        </div>
                        <div className="flex items-center gap-2">
                            {policies.petsAllowed ? (
                                <>
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-sm font-medium text-gray-700">
                                        {t(
                                            translationKey.roomDetails
                                                .petsAllowed
                                        )}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-4 h-4 text-red-500" />
                                    <span className="text-sm font-medium text-gray-700">
                                        {t(
                                            translationKey.roomDetails
                                                .petsNotAllowed
                                        )}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
