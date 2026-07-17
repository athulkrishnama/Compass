import { useCallback, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useInfiniteQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useNavigate, useSearch } from "@tanstack/react-router";

import { createSearchHotelInfiniteQueryOptions } from "@/queryOptions/hotelQueryOptions";
import type { IHotelSearchRequestDTO } from "@/types/api/responses/hotelSearchResponse";
import type { HotelSearchParams } from "@/schemas/hotelSearchParams";

import {
    HotelSearchFilters,
    HotelCard,
    HotelCardSkeleton,
} from "@/components/traveler/hotelSearch";
import translationKey from "@/utils/i18n/translationKey";

const HotelSearch = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const searchParams = useSearch({ from: "/traveler/hotels" });

    const buildRequestDTO = useCallback((): Omit<
        IHotelSearchRequestDTO,
        "pageNo"
    > => {
        return {
            queryString: searchParams.q || undefined,
            guests: searchParams.guests,
            minPrice: searchParams.minPrice,
            maxPrice: searchParams.maxPrice,
            city:
                searchParams.city && searchParams.city.length === 2
                    ? [searchParams.city[0], searchParams.city[1]]
                    : undefined,
            proximityRadius: searchParams.proximityRadius,
        };
    }, [searchParams]);

    const { data, fetchNextPage, isFetchingNextPage, isLoading, hasNextPage } =
        useInfiniteQuery(
            createSearchHotelInfiniteQueryOptions(buildRequestDTO())
        );

    const handleFilterChange = useCallback(
        (newFilters: Partial<HotelSearchParams>) => {
            navigate({
                to: "/traveler/hotels",
                search: (prev) => ({
                    ...prev,
                    ...newFilters,
                }),
                replace: true,
            });
        },
        [navigate]
    );

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.3 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [isFetchingNextPage, fetchNextPage]);

    const hotels = data?.pages.flatMap((page) => page.data?.hotels || []) || [];

    const filters = {
        searchQuery: searchParams.q || "",
        guests: searchParams.guests,
        minPrice: searchParams.minPrice,
        maxPrice: searchParams.maxPrice,
        city:
            searchParams.city && searchParams.city.length === 2
                ? (searchParams.city as [number, number])
                : undefined,
        cityName: searchParams.cityName,
        proximityRadius: searchParams.proximityRadius,
    };

    const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
        const mappedFilters: Partial<HotelSearchParams> = {};
        if ("searchQuery" in newFilters)
            mappedFilters.q = newFilters.searchQuery;
        if ("guests" in newFilters) mappedFilters.guests = newFilters.guests;
        if ("minPrice" in newFilters)
            mappedFilters.minPrice = newFilters.minPrice;
        if ("maxPrice" in newFilters)
            mappedFilters.maxPrice = newFilters.maxPrice;

        if ("city" in newFilters) {
            mappedFilters.city = newFilters.city;
            // Default to 10km if city is selected but no radius is set
            if (newFilters.city && !filters.proximityRadius) {
                mappedFilters.proximityRadius = 10;
            }
        }

        if ("cityName" in newFilters)
            mappedFilters.cityName = newFilters.cityName;
        if ("proximityRadius" in newFilters)
            mappedFilters.proximityRadius = newFilters.proximityRadius;

        handleFilterChange(mappedFilters);
    };

    const handleResetFilters = useCallback(() => {
        navigate({
            to: "/traveler/hotels",
            search: { guests: 1 },
            replace: true,
        });
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-gray-900 italic">
                        {t(translationKey.hotelSearch.searchHotels)}
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <HotelSearchFilters
                        filters={filters}
                        onFilterChange={handleFiltersChange}
                        onReset={handleResetFilters}
                    />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, index) => (
                            <HotelCardSkeleton key={`skeleton-${index}`} />
                        ))
                    ) : hotels.length > 0 ? (
                        [
                            ...hotels.map((hotel, index) => (
                                <motion.div
                                    key={hotel.id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <HotelCard hotel={hotel} />
                                </motion.div>
                            )),
                            ...(isFetchingNextPage
                                ? Array.from({ length: 6 }).map((_, index) => (
                                      <HotelCardSkeleton
                                          key={`skeleton-loading-${index}`}
                                      />
                                  ))
                                : []),
                        ]
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center h-64 text-gray-500">
                            <Search className="w-16 h-16 text-zinc-300 mb-4" />
                            <p className="text-lg">
                                {t(translationKey.hotelSearch.noHotelsFound)}
                            </p>
                        </div>
                    )}
                </div>

                {!hasNextPage && hotels.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-8 text-center text-zinc-400"
                    >
                        {t(translationKey.hotelSearch.noMoreHotels)}
                    </motion.div>
                )}

                <div
                    ref={loadMoreRef}
                    className="py-8 flex items-center justify-center"
                ></div>
            </div>
        </div>
    );
};

export default HotelSearch;
