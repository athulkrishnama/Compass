import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useInfiniteQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

import { createSearchHotelInfiniteQueryOptions } from "@/queryOptions/hotelQueryOptions";
import type { IHotelSearchRequestDTO } from "@/types/api/responses/hotelSearchResponse";

import {
    HotelSearchFilters,
    HotelCard,
    HotelCardSkeleton,
} from "@/components/traveler/hotelSearch";
import translationKey from "@/utils/i18n/translationKey";

interface HotelFilterState {
    searchQuery: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    minPrice?: number;
    maxPrice?: number;
}

const initialFilter: HotelFilterState = {
    searchQuery: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
};

const HotelSearch = () => {
    const { t } = useTranslation();
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const [filter, setFilter] = useState<HotelFilterState>(initialFilter);

    const [appliedFilter, setAppliedFilter] =
        useState<HotelFilterState>(initialFilter);

    const buildRequestDTO = useCallback((): Omit<
        IHotelSearchRequestDTO,
        "pageNo"
    > => {
        return {
            queryString: appliedFilter.searchQuery || undefined,
            checkInDate: appliedFilter.checkIn
                ? new Date(appliedFilter.checkIn).toLocaleDateString("en-GB")
                : undefined,
            checkOutDate: appliedFilter.checkOut
                ? new Date(appliedFilter.checkOut).toLocaleDateString("en-GB")
                : undefined,
            guests: appliedFilter.guests,
            minPrice: appliedFilter.minPrice,
            maxPrice: appliedFilter.maxPrice,
        };
    }, [appliedFilter]);

    const { data, fetchNextPage, isFetchingNextPage, isLoading, hasNextPage } =
        useInfiniteQuery(
            createSearchHotelInfiniteQueryOptions(buildRequestDTO())
        );

    const handleSearch = useCallback(() => {
        setAppliedFilter({ ...filter });
    }, [filter]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [isFetchingNextPage, fetchNextPage]);

    const hotels = data?.pages.flatMap((page) => page.data?.hotels || []) || [];

    const handleFilterChange = (newFilters: Partial<HotelFilterState>) => {
        setFilter((prev) => ({ ...prev, ...newFilters }));
    };

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
                        filters={filter}
                        onFilterChange={handleFilterChange}
                        onSearch={handleSearch}
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
                                    key={hotel._id || index}
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
