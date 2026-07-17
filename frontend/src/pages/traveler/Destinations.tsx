import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useInfiniteQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import DestinationCard from "@/components/traveler/destinations/DestinationCard";
import DestinationCardSkeleton from "@/components/traveler/destinations/DestinationCardSkeleton";
import DestinationFilters, {
    type DestinationFilterState,
} from "@/components/traveler/destinations/DestinationFilters";
import NoMoreDestinations from "@/components/traveler/destinations/NoMoreDestinations";
import { createGetDestinationsQueryOption } from "@/queryOptions/destinationQueryOptions";
import translationKey from "@/utils/i18n/translationKey";
import type { IListDestinationRequestDTO } from "@/types/api/requests/destinationRequest";

function Destinations() {
    const { t } = useTranslation();
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const [filter, setFilter] = useState<DestinationFilterState>({
        queryString: "",
        type: undefined,
        activites: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        city: undefined,
        cityName: undefined,
        proximityRadius: undefined,
        onlyFree: undefined,
        isWheelchairAccessible: undefined,
        isActive: true,
        sortBy: undefined,
        sortOrder: undefined,
    });

    const buildRequestDTO = useCallback((): IListDestinationRequestDTO => {
        return {
            pageNo: 1,
            queryString: filter.queryString || undefined,
            type: filter.type,
            activities: filter.activites,
            minPrice: filter.minPrice,
            maxPrice: filter.maxPrice,
            city: filter.city,
            proximityRadius: filter.proximityRadius,
            isActive: filter.isActive,
            onlyFree: filter.onlyFree,
            isWheelchairAccessible: filter.isWheelchairAccessible,
            sortBy: filter.sortBy,
            sortOrder: filter.sortOrder,
        };
    }, [filter]);

    const {
        data,
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        refetch,
        hasNextPage,
    } = useInfiniteQuery(createGetDestinationsQueryOption(buildRequestDTO()));

    const handleSearch = useCallback(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { rootMargin: "200px 0px", threshold: 0 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [isFetchingNextPage, fetchNextPage]);

    const destinations =
        data?.pages.flatMap((page) => page.data?.destinations || []) || [];

    return (
        <div className="min-h-screen  bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-gray-900 italic">
                        {t(translationKey.headings.destinations)}
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <DestinationFilters
                        filter={filter}
                        setFilter={setFilter}
                        onSearch={handleSearch}
                    />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, index) => (
                            <DestinationCardSkeleton
                                key={`skeleton-${index}`}
                            />
                        ))
                    ) : destinations.length > 0 ? (
                        [
                            ...destinations.map((destination, index) => (
                                <motion.div
                                    key={destination.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <DestinationCard
                                        id={destination.id}
                                        name={destination.name}
                                        tagline={destination.tagline}
                                        coverImage={destination.coverImage}
                                        type={destination.type}
                                        activities={destination.activities}
                                        city={destination.city}
                                        isFree={destination.isFree}
                                        entryFee={destination.entryFee}
                                        isActive={destination.isActive}
                                        isWheelChairAccessible={
                                            destination.isWheelChairAccessible
                                        }
                                    />
                                </motion.div>
                            )),
                            ...(isFetchingNextPage
                                ? Array.from({ length: 6 }).map((_, index) => (
                                      <DestinationCardSkeleton
                                          key={`skeleton-${index}`}
                                      />
                                  ))
                                : []),
                        ]
                    ) : (
                        <div className="col-span-full flex items-center justify-center h-64 text-gray-500">
                            {t(translationKey.text.noDestinationsFound)}
                        </div>
                    )}
                </div>

                {!hasNextPage && destinations.length > 0 && (
                    <NoMoreDestinations />
                )}

                <div
                    ref={loadMoreRef}
                    className="py-8 flex items-center justify-center"
                ></div>
            </div>
        </div>
    );
}

export default Destinations;
