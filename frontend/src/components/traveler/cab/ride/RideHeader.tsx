import { useTranslation } from "react-i18next";
import type { RideStatus } from "@/types/rideStatus";
import { RIDE_STATUSES } from "@/types/rideStatus";
import translationKey from "@/utils/i18n/translationKey";

const STATUS_CONFIG: Record<string, { key: string; dotColor: string }> = {
    [RIDE_STATUSES.SEARCHING]: {
        key: translationKey.rideDetails.searching,
        dotColor: "bg-amber-500",
    },
    [RIDE_STATUSES.MATCHED]: {
        key: translationKey.rideDetails.driverMatched,
        dotColor: "bg-emerald-500",
    },
    [RIDE_STATUSES.IN_TRANSIT]: {
        key: translationKey.rideDetails.inTransit,
        dotColor: "bg-blue-500",
    },
    [RIDE_STATUSES.ARRIVED]: {
        key: translationKey.rideDetails.arrived,
        dotColor: "bg-green-500",
    },
    [RIDE_STATUSES.CANCELLED]: {
        key: translationKey.rideDetails.cancelled,
        dotColor: "bg-red-500",
    },
};

interface RideHeaderProps {
    status: RideStatus;
}

const RideHeader = ({ status }: RideHeaderProps) => {
    const { t } = useTranslation();
    const config = STATUS_CONFIG[status] ?? {
        key: "",
        dotColor: "bg-neutral-400",
    };

    const label = config.key ? t(config.key) : status;

    return (
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-black">
                {t(translationKey.rideDetails.yourRide)}
            </h1>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200">
                <span
                    className={`w-2 h-2 rounded-full ${config.dotColor} animate-pulse`}
                />
                <span className="text-xs font-medium text-neutral-700">
                    {label}
                </span>
            </div>
        </div>
    );
};

export default RideHeader;
