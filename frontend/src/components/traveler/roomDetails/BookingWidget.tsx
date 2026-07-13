import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    IndianRupee,
    CalendarDays,
    Users,
    Info,
    Plus,
    Minus,
    DoorOpen,
    BedDouble,
    Loader2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import translationKey from "@/utils/i18n/translationKey";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format, differenceInDays } from "date-fns";
import { type DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { useQuery, useMutation } from "@tanstack/react-query";
import { createGetRoomVariantAvailabilityQueryOptions } from "@/queryOptions/roomVariantQueryOptions";
import { createCreatePaymentIntentMutationOptions } from "@/queryOptions/paymentQueryOptions";
import { useNavigate } from "@tanstack/react-router";

interface BookingWidgetProps {
    roomVariantId: string;
    basePrice: number;
    maxOccupancy: number;
}

export default function BookingWidget({
    roomVariantId,
    basePrice,
    maxOccupancy,
}: BookingWidgetProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [guestCount, setGuestCount] = useState(1);
    const [roomCount, setRoomCount] = useState(1);
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(new Date().setDate(new Date().getDate() + 2)),
    });

    const nights =
        date?.from && date?.to ? differenceInDays(date.to, date.from) : 0;

    const { data: availabilityData, isLoading: isLoadingAvailability } =
        useQuery({
            ...createGetRoomVariantAvailabilityQueryOptions({
                roomVariantId,
                checkinDate: date?.from ?? new Date(),
                checkoutDate:
                    date?.to ??
                    new Date(new Date().setDate(new Date().getDate() + 2)),
            }),
            enabled: !!date?.from && !!date?.to,
        });

    const availableRooms = availabilityData?.data?.available ?? 0;
    const dynamicPrice = availabilityData?.data?.dynamicPrice || 0;
    const pricePerRoom =
        dynamicPrice > 0 ? dynamicPrice : basePrice * Math.max(nights, 1);
    const total = pricePerRoom * roomCount;

    useEffect(() => {
        if (maxOccupancy > 0) {
            const suggested = Math.ceil(guestCount / maxOccupancy);
            const clamped = Math.max(
                1,
                Math.min(suggested, availableRooms || 1)
            );
            setRoomCount(clamped);
        }
    }, [guestCount, maxOccupancy, availableRooms]);

    const { mutate: createPaymentIntent, isPending: isCreatingPaymentIntent } =
        useMutation({
            ...createCreatePaymentIntentMutationOptions(),
            onSuccess: (data) => {
                if (!date?.from || !date?.to || !data?.data) return;

                navigate({
                    to: "/traveler/booking-confirmation",
                    search: {
                        roomVariantId,
                        checkInDate: date.from.toDateString(),
                        checkOutDate: date.to.toDateString(),
                        guests: guestCount,
                        numberOfRooms: roomCount,
                        paymentIntentId: data.data.paymentIntentId,
                        clientSecret: data.data.clientSecret,
                        amount: data.data.amount,
                    },
                });
            },
        });

    const handleIncrementGuests = () => {
        if (guestCount < maxOccupancy * (availableRooms || 1)) {
            setGuestCount(guestCount + 1);
        }
    };

    const handleDecrementGuests = () => {
        if (guestCount > 1) {
            setGuestCount(guestCount - 1);
        }
    };

    const handleIncrementRooms = () => {
        if (roomCount < availableRooms) {
            setRoomCount(roomCount + 1);
        }
    };

    const handleDecrementRooms = () => {
        if (roomCount > 1) {
            if ((roomCount - 1) * maxOccupancy < guestCount) return;
            setRoomCount(roomCount - 1);
        }
    };

    const handleBooking = () => {
        if (!date?.from || !date?.to) return;

        createPaymentIntent({
            roomVariantId,
            checkInDate: date.from,
            checkOutDate: date.to,
            guests: guestCount,
            numberOfRooms: roomCount,
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="sticky top-6"
        >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="mb-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <div className="grid grid-cols-2 gap-0 border border-gray-200 rounded-xl overflow-hidden hover:border-gray-400 transition-colors cursor-pointer">
                                <div className="p-3 border-r border-gray-200">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <CalendarDays className="w-4 h-4" />
                                        <span className="text-[10px] uppercase font-bold tracking-wider">
                                            {t(
                                                translationKey.hotelSearch
                                                    .checkIn
                                            )}
                                        </span>
                                    </div>
                                    <p
                                        className={cn(
                                            "text-sm font-semibold",
                                            !date?.from && "text-gray-400"
                                        )}
                                    >
                                        {date?.from
                                            ? format(date.from, "LLL dd, y")
                                            : t(
                                                  translationKey.roomDetails
                                                      .selectDate
                                              )}
                                    </p>
                                </div>
                                <div className="p-3">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <CalendarDays className="w-4 h-4" />
                                        <span className="text-[10px] uppercase font-bold tracking-wider">
                                            {t(
                                                translationKey.hotelSearch
                                                    .checkOut
                                            )}
                                        </span>
                                    </div>
                                    <p
                                        className={cn(
                                            "text-sm font-semibold",
                                            !date?.to && "text-gray-400"
                                        )}
                                    >
                                        {date?.to
                                            ? format(date.to, "LLL dd, y")
                                            : t(
                                                  translationKey.roomDetails
                                                      .selectDate
                                              )}
                                    </p>
                                </div>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={1}
                                disabled={(d: Date) =>
                                    d <
                                    new Date(new Date().setHours(0, 0, 0, 0))
                                }
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Guests counter */}
                <div className="p-3 border border-gray-200 rounded-xl mb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-700">
                            <Users className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                {t(translationKey.hotelSearch.guests)}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleDecrementGuests}
                                disabled={guestCount <= 1}
                                className="p-1.5 rounded-full border border-gray-300 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <Minus className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="text-lg font-semibold text-gray-900 w-6 text-center">
                                {guestCount}
                            </span>
                            <button
                                onClick={handleIncrementGuests}
                                disabled={
                                    guestCount >=
                                    maxOccupancy * (availableRooms || 1)
                                }
                                className="p-1.5 rounded-full border border-gray-300 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <Plus className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        {t(translationKey.hotelSearch.maxGuests, {
                            count: maxOccupancy,
                        })}
                    </p>
                </div>

                {/* Rooms counter */}
                <div className="p-3 border border-gray-200 rounded-xl mb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-700">
                            <BedDouble className="w-4 h-4" />
                            <span className="text-sm font-medium">Rooms</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleDecrementRooms}
                                disabled={roomCount <= 1}
                                className="p-1.5 rounded-full border border-gray-300 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <Minus className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="text-lg font-semibold text-gray-900 w-6 text-center">
                                {roomCount}
                            </span>
                            <button
                                onClick={handleIncrementRooms}
                                disabled={roomCount >= availableRooms}
                                className="p-1.5 rounded-full border border-gray-300 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <Plus className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Auto-suggested from guest count · max {maxOccupancy}{" "}
                        guests/room
                    </p>
                </div>

                {/* Availability badge */}
                <div className="p-3 border border-gray-200 rounded-xl mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-700">
                            <DoorOpen className="w-4 h-4" />
                            <span className="text-sm font-medium">
                                {t(translationKey.roomDetails.availability)}
                            </span>
                        </div>
                        {isLoadingAvailability ? (
                            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                        ) : (
                            <span
                                className={cn(
                                    "px-2.5 py-1 rounded-full text-xs font-semibold",
                                    availableRooms > 0
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                )}
                            >
                                {availableRooms > 0
                                    ? t(
                                          translationKey.roomDetails
                                              .roomsAvailable,
                                          {
                                              count: availableRooms,
                                          }
                                      )
                                    : t(
                                          translationKey.roomDetails
                                              .noRoomsAvailable
                                      )}
                            </span>
                        )}
                    </div>
                </div>

                <Button
                    className="w-full h-12 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-medium rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={
                        availableRooms <= 0 ||
                        roomCount > availableRooms ||
                        isLoadingAvailability ||
                        isCreatingPaymentIntent
                    }
                    onClick={handleBooking}
                >
                    {isCreatingPaymentIntent ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        t(translationKey.roomDetails.bookYourStay)
                    )}
                </Button>

                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>{t(translationKey.roomDetails.noExtraCharges)}</span>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                            {t(translationKey.roomDetails.baseNights, {
                                price:
                                    dynamicPrice > 0 &&
                                    dynamicPrice !==
                                        basePrice * Math.max(nights, 1)
                                        ? "Dynamic"
                                        : `₹${basePrice.toLocaleString("en-IN")}`,
                                nights: Math.max(nights, 1),
                            })}
                        </span>
                        <span className="flex items-center text-gray-900">
                            <IndianRupee className="w-3 h-3" />
                            {pricePerRoom.toLocaleString("en-IN")}
                        </span>
                    </div>
                    {roomCount > 1 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                                × {roomCount} rooms
                            </span>
                            <span className="flex items-center font-semibold text-gray-900">
                                <IndianRupee className="w-3 h-3" />
                                {total.toLocaleString("en-IN")}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
