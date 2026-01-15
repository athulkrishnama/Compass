import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, SquarePen, ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import type { Hotel } from "@/types/api/responses/getHotelsByUserId";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import { Link } from "@tanstack/react-router";

interface HotelCardProps {
    hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
    const { t } = useTranslation();

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <Card className="overflow-hidden p-0 border-none shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col rounded-[1rem]">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted rounded-t-[1rem]">
                    {hotel.coverImage ? (
                        <img
                            src={hotel.coverImage}
                            alt={hotel.name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <ImageIcon className="h-12 w-12 opacity-20" />
                        </div>
                    )}
                </div>
                <CardContent className="p-8 flex-grow space-y-4">
                    <h3 className="text-2xl font-bold leading-tight line-clamp-1">
                        {hotel.name}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground font-medium">
                        <MapPin className="h-4 w-4 mr-1.5" />
                        <span className="line-clamp-1">
                            {hotel.city}, {hotel.country}
                        </span>
                    </div>
                    <p className="text-base text-muted-foreground/80 line-clamp-2 leading-relaxed">
                        {hotel.description}
                    </p>
                </CardContent>
                <CardFooter className="p-8 pt-0">
                    <Button
                        asChild
                        variant="outline"
                        className="w-full h-12 rounded-full border-muted-foreground/20 hover:bg-accent group text-base font-semibold"
                    >
                        <Link
                            to="/hotel/hotels/edit/$hotelId"
                            params={{ hotelId: hotel.id }}
                        >
                            <SquarePen className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                            {t(translationKey.button.editDetails)}
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
