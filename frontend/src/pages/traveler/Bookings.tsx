import { useState, useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { BookingCard } from "@/components/booking/BookingCard";
import { BookingTabs } from "@/components/booking/BookingTabs";
import { BookingCardSkeleton } from "@/components/booking/BookingCardSkeleton";
import { EmptyBookingsState } from "@/components/booking/EmptyBookingsState";
import {
    createGetUpcomingBookingsInfiniteQueryOptions,
    createGetOngoingBookingsInfiniteQueryOptions,
    createGetCompletedBookingsInfiniteQueryOptions,
} from "@/queryOptions/bookingQueryOptions";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

function Bookings() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<"upcoming" | "ongoing" | "past">(
        "upcoming"
    );
    const observerTarget = useRef<HTMLDivElement>(null);

    const upcomingQuery = useInfiniteQuery(
        createGetUpcomingBookingsInfiniteQueryOptions()
    );

    const ongoingQuery = useInfiniteQuery(
        createGetOngoingBookingsInfiniteQueryOptions()
    );

    const pastQuery = useInfiniteQuery(
        createGetCompletedBookingsInfiniteQueryOptions()
    );

    const activeQuery =
        activeTab === "upcoming"
            ? upcomingQuery
            : activeTab === "ongoing"
              ? ongoingQuery
              : pastQuery;

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
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-4rem)]">
            <div className="mb-12">
                <p className="text-[10px] font-bold text-muted-foreground/60 tracking-[0.3em] uppercase mb-3">
                    {activeTab === "upcoming"
                        ? "Your Stays"
                        : activeTab === "ongoing"
                          ? "Current Stay"
                          : "Travel History"}
                </p>
                <h1 className="text-5xl font-serif text-foreground tracking-tight">
                    {t(translationKey.bookingHistory.title)}
                </h1>
            </div>

            <div className="mb-12 overflow-x-auto hide-scroll-bar">
                <BookingTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            <div className="">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <BookingCardSkeleton key={i} />
                        ))}
                    </div>
                ) : isEmpty ? (
                    <div className="py-20 text-center">
                        <EmptyBookingsState type={activeTab} />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-x-10 md:gap-y-12">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                                <BookingCardSkeleton />
                            </div>
                        )}

                        {activeQuery.hasNextPage &&
                            !activeQuery.isFetchingNextPage && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-center py-12"
                                >
                                    <button
                                        onClick={() =>
                                            activeQuery.fetchNextPage()
                                        }
                                        className="group inline-flex items-center gap-2 px-8 py-4 text-sm font-bold border border-border rounded-full hover:bg-foreground hover:text-background transition-all duration-300"
                                    >
                                        {t(
                                            translationKey.bookingHistory
                                                .loadMoreHistory
                                        )}
                                        <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
                                    </button>
                                </motion.div>
                            )}
                    </>
                )}
            </div>
        </div>
    );
}

export default Bookings;
