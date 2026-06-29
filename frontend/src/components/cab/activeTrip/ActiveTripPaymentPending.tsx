import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import MapboxMap, { type MapboxMarker } from "@/components/shared/MapboxMap";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface ActiveTripPaymentPendingProps {
    paymentMethod?: string;
    fare?: number;
    markers: MapboxMarker[];
    routeCoordinates: [number, number][];
    mapCenter?: [number, number];
}

export function ActiveTripPaymentPending({
    paymentMethod,
    fare = 0,
    markers,
    routeCoordinates,
    mapCenter,
}: ActiveTripPaymentPendingProps) {
    const { t } = useTranslation();
    const commission = fare * 0.1;
    const earnings = fare * 0.9;

    return (
        <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] p-6 md:p-8 flex flex-col items-center max-w-lg mx-auto w-full border border-gray-200"
        >
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mb-6" />

            <div className="flex flex-col items-center text-center w-full mb-6">
                <div className="relative mb-6">
                    <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl">₹</span>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-black tracking-tight mb-2">
                    {t(translationKey.activeTrip.paymentPendingTitle)}
                </h2>
                <p className="text-gray-500 font-medium">
                    {paymentMethod === "CASH"
                        ? t(translationKey.activeTrip.collectCashPrompt)
                        : t(translationKey.activeTrip.waitOnlinePaymentPrompt)}
                </p>
            </div>

            <Card className="w-full bg-gray-50 border-gray-200 shadow-none mb-2">
                <CardContent className="p-4 flex flex-col gap-4">
                    <div className="w-full h-[140px] rounded-xl overflow-hidden border border-gray-200 relative pointer-events-none">
                        <MapboxMap
                            markers={markers}
                            routeCoordinates={routeCoordinates}
                            initialCenter={mapCenter}
                            initialZoom={13}
                            className="w-full h-full rounded-none"
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <h3 className="font-semibold text-black text-lg">
                            {t(translationKey.activeTrip.tripOverview)}
                        </h3>
                        <div className="flex justify-between items-center text-sm font-medium text-gray-600">
                            <span>
                                {t(translationKey.activeTrip.totalFare)}
                            </span>
                            <span className="text-black">
                                ₹ {fare.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-medium text-gray-600">
                            <span>
                                {t(translationKey.activeTrip.commission10)}
                            </span>
                            <span className="text-black">
                                - ₹ {commission.toFixed(2)}
                            </span>
                        </div>
                        <Separator className="bg-gray-200" />
                        <div className="flex justify-between items-center font-bold text-black text-lg">
                            <span>
                                {t(translationKey.activeTrip.yourEarnings)}
                            </span>
                            <span>₹ {earnings.toFixed(2)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
