import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MapPin, IndianRupee } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { IHotelWithRoomVariantDetails } from "@/types/api/responses/hotelSearchResponse";
import translationKey from "@/utils/i18n/translationKey";

interface HotelCardProps {
    hotel: IHotelWithRoomVariantDetails;
}

export const HotelCard = ({ hotel }: HotelCardProps) => {
    const { t } = useTranslation();

    const hasRoomVariants = hotel.roomVariants && hotel.roomVariants.length > 0;

    const lowestPrice = hasRoomVariants
        ? hotel.roomVariants.reduce((min, variant) => {
              return variant.price < min ? variant.price : min;
          }, hotel.roomVariants[0].price)
        : 0;

    return (
        <Link
            to="/traveler/hotel/$hotelId"
            params={{ hotelId: hotel.id }}
            className="block h-full"
        >
            <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-zinc-100 h-full flex flex-col"
            >
                <div className="relative aspect-[4/3] overflow-hidden flex-shrink-0">
                    <img
                        src={hotel.coverImage}
                        alt={hotel.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {hasRoomVariants && (
                        <Badge className="absolute top-3 right-3 bg-black/80 text-white">
                            {hotel.roomVariants.length}{" "}
                            {t(
                                translationKey.hotelSearch.availableRoomVariants
                            )}
                        </Badge>
                    )}
                </div>

                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-semibold text-lg text-black line-clamp-1 mb-1">
                        {hotel.name}
                    </h3>
                    <div className="flex items-center gap-1 text-zinc-500 text-sm mb-2">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="line-clamp-1">
                            {hotel.city}
                            {hotel.country ? `, ${hotel.country}` : ""}
                        </span>
                    </div>

                    <p className="text-zinc-600 text-sm line-clamp-2 mb-3 min-h-[2.5rem]">
                        {hotel.description || ""}
                    </p>

                    <div className="pt-3 border-t border-zinc-100 mt-auto">
                        {hasRoomVariants ? (
                            <div className="flex flex-col gap-1">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xs text-zinc-500">
                                        {t(
                                            translationKey.hotelSearch
                                                .startsFrom
                                        )}
                                    </span>
                                    <span className="flex items-center text-lg font-bold text-black">
                                        <IndianRupee className="w-4 h-4" />
                                        {lowestPrice.toLocaleString("en-IN")}
                                    </span>
                                    <span className="text-zinc-500 text-sm">
                                        {t(translationKey.hotelSearch.perNight)}
                                    </span>
                                </div>
                                <p className="text-[10px] text-zinc-400 leading-tight">
                                    {t(
                                        translationKey.hotelSearch.pricesMayVary
                                    )}
                                </p>
                            </div>
                        ) : (
                            <span className="text-zinc-500 text-sm">
                                {t(translationKey.hotelSearch.noHotelsFound)}
                            </span>
                        )}
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};
