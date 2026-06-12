import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RIDE_STATUSES } from "@/types/rideStatus";
import translationKey from "@/utils/i18n/translationKey";
import type { IRideDetailsResponseDTO } from "@/types/api/responses/rideResponses";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronDown,
    ChevronUp,
    Clock,
    CheckCircle2,
    MapPin,
    Navigation,
    XCircle,
    Info,
    CalendarClock,
} from "lucide-react";
import { format } from "date-fns";
import { ROLES } from "@/constants/roles";
import type { RideEventName } from "@/types/rideEvent";
import { RIDE_EVENT_NAMES } from "@/types/rideEvent";

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

const getEventIcon = (eventName: RideEventName | string) => {
    switch (eventName) {
        case RIDE_EVENT_NAMES.REQUESTED:
            return <CalendarClock className="w-4 h-4 text-neutral-400" />;
        case RIDE_EVENT_NAMES.ACCEPTED:
        case RIDE_EVENT_NAMES.COMPLETED:
            return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
        case RIDE_EVENT_NAMES.ARRIVED:
            return <MapPin className="w-4 h-4 text-blue-500" />;
        case RIDE_EVENT_NAMES.STARTED:
            return <Navigation className="w-4 h-4 text-blue-500" />;
        case RIDE_EVENT_NAMES.CANCELLED:
        default:
            return <Info className="w-4 h-4 text-neutral-400" />;
    }
};

const getEventLabel = (eventName: string) => {
    return eventName
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
};

interface RideHeaderProps {
    ride: IRideDetailsResponseDTO;
}

const RideHeader = ({ ride }: RideHeaderProps) => {
    const { t } = useTranslation();
    const [isEventsExpanded, setIsEventsExpanded] = useState(false);

    const config = STATUS_CONFIG[ride.status] ?? {
        key: "",
        dotColor: "bg-neutral-400",
    };

    const label = config.key ? t(config.key) : ride.status;
    const events = ride.events || [];

    const renderCancelledBy = () => {
        if (ride.status !== RIDE_STATUSES.CANCELLED) return null;

        let cancelledText = t(translationKey.rideDetails.cancelledBySystem);
        if (ride.cancelled_by === ROLES.TRAVELER) {
            cancelledText = t(translationKey.rideDetails.cancelledByYou);
        } else if (ride.cancelled_by === ROLES.CAB) {
            cancelledText = t(translationKey.rideDetails.cancelledByDriver);
        } else if (ride.cancelled_by === ROLES.ADMIN) {
            cancelledText = t(translationKey.rideDetails.cancelledByAdmin);
        }

        return (
            <div className="mt-4 flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-neutral-800">
                        {t(translationKey.rideDetails.rideCancelled)}
                    </span>
                    <span className="text-xs text-neutral-500 mt-0.5">
                        {cancelledText}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col">
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

            {renderCancelledBy()}

            {events.length > 0 && (
                <div className="mt-4 border border-neutral-100 rounded-xl bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-neutral-400" />
                            {t(translationKey.rideDetails.timeline)}
                        </h3>
                        {events.length > 1 && (
                            <button
                                onClick={() =>
                                    setIsEventsExpanded(!isEventsExpanded)
                                }
                                className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors flex items-center gap-1"
                            >
                                {isEventsExpanded
                                    ? t(translationKey.rideDetails.hideHistory)
                                    : t(translationKey.rideDetails.showHistory)}
                                {isEventsExpanded ? (
                                    <ChevronUp className="w-3 h-3" />
                                ) : (
                                    <ChevronDown className="w-3 h-3" />
                                )}
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col pl-1">
                        <AnimatePresence initial={false}>
                            {events.map((event, index) => {
                                const isLast = index === events.length - 1;
                                const isHidden = !isEventsExpanded && !isLast;

                                return (
                                    !isHidden && (
                                        <motion.div
                                            key={index}
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{
                                                height: "auto",
                                                opacity: 1,
                                            }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div
                                                className={`flex gap-3 relative ${isLast ? "" : "pb-4"}`}
                                            >
                                                {!isLast && (
                                                    <div className="absolute left-[7px] top-5 bottom-0 w-[1.5px] bg-neutral-100" />
                                                )}

                                                <div className="relative z-10 bg-white mt-0.5">
                                                    <div className="scale-90">
                                                        {getEventIcon(
                                                            event.event_name
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col">
                                                    <span
                                                        className={`text-xs font-medium ${isLast ? "text-neutral-800" : "text-neutral-500"}`}
                                                    >
                                                        {getEventLabel(
                                                            event.event_name
                                                        )}
                                                    </span>
                                                    <span
                                                        className={`text-[11px] mt-0.5 ${isLast ? "text-neutral-500" : "text-neutral-400"}`}
                                                    >
                                                        {format(
                                                            new Date(
                                                                event.timestamp
                                                            ),
                                                            "MMM d, yyyy h:mm a"
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RideHeader;
