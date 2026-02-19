import { motion } from "framer-motion";
import { Users, BedDouble } from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

interface RoomInfoCardProps {
    roomVariant: {
        name: string;
        coverImage: string;
        description: string;
        maxOccupancy: number;
        bedConfig: {
            type: string;
            count: number;
        };
    };
}

function formatBedType(type: string): string {
    return type
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function RoomInfoCard({ roomVariant }: RoomInfoCardProps) {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="rounded-2xl overflow-hidden border border-border bg-background flex flex-col h-[340px] sm:h-[380px] shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
            <div className="relative h-[180px] sm:h-[200px] flex-shrink-0 overflow-hidden">
                <img
                    src={roomVariant.coverImage}
                    alt={roomVariant.name}
                    className="w-full h-full object-cover"
                />
                <span className="absolute top-3 right-3 px-3 py-1 bg-white text-black text-xs font-semibold rounded-full shadow-sm">
                    {formatBedType(roomVariant.bedConfig.type)}
                </span>
            </div>

            <div className="flex-1 p-5 flex flex-col">
                <h3 className="text-lg font-semibold text-foreground">
                    {roomVariant.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {roomVariant.description}
                </p>

                <div className="mt-auto space-y-2.5 pt-3 border-t border-border/50">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                            <Users className="w-3.5 h-3.5" />
                            {t(translationKey.bookingDetails.totalGuests)}
                        </span>
                        <span className="font-medium text-foreground">
                            {t(translationKey.bookingDetails.adults, {
                                count: roomVariant.maxOccupancy,
                            })}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                            <BedDouble className="w-3.5 h-3.5" />
                            {t(translationKey.bookingDetails.bedType)}
                        </span>
                        <span className="font-medium text-foreground">
                            {roomVariant.bedConfig.count}{" "}
                            {formatBedType(roomVariant.bedConfig.type)}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
