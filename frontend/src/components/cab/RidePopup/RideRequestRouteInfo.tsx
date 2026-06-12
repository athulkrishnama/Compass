import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface RouteInfoProps {
    pickupAddress: string;
    pickupAddressLoading: boolean;
    dropoffAddress: string;
    dropoffAddressLoading: boolean;
}

export function RideRequestRouteInfo({
    pickupAddress,
    pickupAddressLoading,
    dropoffAddress,
    dropoffAddressLoading,
}: RouteInfoProps) {
    const { t } = useTranslation();
    return (
        <div className="px-5 space-y-3 mb-4">
            <div className="flex gap-3 items-start">
                <span className="mt-1 w-2 h-2 rounded-full bg-gray-800 shrink-0" />
                <div>
                    <p className="text-sm font-semibold text-gray-900 leading-tight">
                        {t(translationKey.cabHome.pickup)}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {pickupAddressLoading
                            ? "Fetching address..."
                            : pickupAddress}
                    </p>
                </div>
            </div>

            <div className="ml-1 w-px h-4 bg-gray-200" />

            <div className="flex gap-3 items-start">
                <span className="mt-1 w-2 h-2 rounded-sm bg-gray-800 shrink-0" />
                <div>
                    <p className="text-sm font-semibold text-gray-900 leading-tight">
                        {t(translationKey.rideRequestPopup.dropoff)}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {dropoffAddressLoading
                            ? "Fetching address..."
                            : dropoffAddress}
                    </p>
                </div>
            </div>
        </div>
    );
}
