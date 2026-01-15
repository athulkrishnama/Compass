import { useSuspenseQuery } from "@tanstack/react-query";
import { createGetHotelsByUserIdQueryOptions } from "@/queryOptions/hotelQueryOptions";
import { HotelListingHeader } from "@/components/hotel/HotelListing/HotelListingHeader";
import { HotelGrid } from "@/components/hotel/HotelListing/HotelGrid";
import { EmptyHotelState } from "@/components/hotel/HotelListing/EmptyHotelState";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";

function Hotels() {
    const { t } = useTranslation();
    const {
        data: { data },
    } = useSuspenseQuery(createGetHotelsByUserIdQueryOptions());

    const hotels = data?.hotels || [];
    const count = data?.count || 0;

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-4rem)] flex flex-col">
            <HotelListingHeader count={count} />

            <div className="flex-grow">
                {hotels.length > 0 ? (
                    <>
                        <HotelGrid hotels={hotels} />

                        {hotels.length < count && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center mt-16 space-y-4"
                            >
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="rounded-full px-8 bg-muted/30 border-muted-foreground/10 hover:bg-muted/50"
                                >
                                    <ChevronDown className="mr-2 h-4 w-4" />
                                    {t(
                                        translationKey.button.loadMoreProperties
                                    )}
                                </Button>
                                <p className="text-xs text-muted-foreground">
                                    {t(
                                        translationKey.text
                                            .showingHotelsOfTotal,
                                        {
                                            count: hotels.length,
                                            total: count,
                                        }
                                    )}
                                </p>
                            </motion.div>
                        )}
                    </>
                ) : (
                    <EmptyHotelState />
                )}
            </div>
        </div>
    );
}

export default Hotels;
