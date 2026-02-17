import { useState, useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { BookingCard } from "@/components/booking/BookingCard";
import { BookingTabs } from "@/components/booking/BookingTabs";
import { BookingCardSkeleton } from "@/components/booking/BookingCardSkeleton";
import { EmptyBookingsState } from "@/components/booking/EmptyBookingsState";
import {
    createGetUpcomingBookingsInfiniteQueryOptions,
    createGetCompletedBookingsInfiniteQueryOptions,
} from "@/queryOptions/bookingQueryOptions";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import { motion } from "framer-motion";

function Bookings() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
    const observerTarget = useRef<HTMLDivElement>(null);

    const upcomingQuery = useInfiniteQuery(
        createGetUpcomingBookingsInfiniteQueryOptions()
    );

    const completedQuery = useInfiniteQuery(
        createGetCompletedBookingsInfiniteQueryOptions()
    );

    const activeQuery =
        activeTab === "upcoming" ? upcomingQuery : completedQuery;

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    activeQuery.hasNextPage &&
                    !activeQuery.isFetchingNextPage
                ) {
                    activeQuery.fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [activeQuery]);

    const bookings =
        activeQuery.data?.pages.flatMap((page) => page.data?.bookings || []) ||
        [];

    const isLoading = activeQuery.isLoading;
    const isEmpty = !isLoading && bookings.length === 0;

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-4rem)]">
            <div className="mb-8">
                <p className="text-xs font-medium text-muted-foreground tracking-wider mb-2">
                    {t(translationKey.bookingHistory.yourProfile)}
                </p>
                <h1 className="text-4xl font-bold text-foreground">
                    {t(translationKey.bookingHistory.title)}
                </h1>
            </div>

            <BookingTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="mt-8">
                {isLoading ? (
                    <div className="space-y-6">
                        {[...Array(3)].map((_, i) => (
                            <BookingCardSkeleton key={i} />
                        ))}
                    </div>
                ) : isEmpty ? (
                    <EmptyBookingsState type={activeTab} />
                ) : (
                    <>
                        <div className="space-y-6">
                            {bookings.map((booking) => (
                                <BookingCard
                                    key={booking.id}
                                    id={booking.id}
                                    hotelName={booking.hotelName}
                                    coverImage={booking.coverImage}
                                    city={booking.city}
                                    checkInDate={booking.checkInDate}
                                    checkOutDate={booking.checkOutDate}
                                    totalAmount={booking.totalAmount}
                                    status={booking.status}
                                />
                            ))}
                        </div>

                        <div ref={observerTarget} className="h-20" />

                        {activeQuery.isFetchingNextPage && (
                            <div className="mt-6">
                                <BookingCardSkeleton />
                            </div>
                        )}

                        {!activeQuery.hasNextPage && bookings.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-8 text-sm text-muted-foreground"
                            >
                                {t(translationKey.hotelSearch.noMoreHotels)}
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default Bookings;
