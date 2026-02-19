import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Loader2,
    Calendar,
    LogOut,
    User,
    Mail,
    AlertCircle,
    CheckCircle2,
    BedDouble,
} from "lucide-react";
import { createCheckOutMutationOptions } from "@/queryOptions/bookingQueryOptions";
import Modal from "@/components/shared/modal/Modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Verify imports
import translationKeys from "@/utils/i18n/translationKey";
import type { IHotelBookingListingItem } from "@/types/api/responses/bookingResponse";
import { QUERY_KEYS } from "@/constants/queryKeys/queryKeys";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CheckOutModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking: IHotelBookingListingItem;
    hotelId: string;
}

export default function CheckOutModal({
    isOpen,
    onClose,
    booking,
    hotelId,
}: CheckOutModalProps) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const {
        mutate: checkOut,
        isPending: isCheckingOut,
        error: checkOutError,
    } = useMutation({
        ...createCheckOutMutationOptions(),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.HOTEL_BOOKINGS],
            });
            onClose();
        },
    });

    const handleCheckOut = () => {
        checkOut({
            hotelId,
            bookingId: booking.id,
        });
    };

    return (
        <Modal isOpen={isOpen} handleClose={onClose}>
            <div className="flex flex-col gap-6">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="font-mono text-xs">
                            #BK-{booking.id.slice(-3).toUpperCase()}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                            {new Date().toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                            })}
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        {t(translationKeys.checkIn.checkOutManagement)}
                    </h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Guest Details */}
                    <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2 text-primary">
                            <User className="w-4 h-4" />
                            {t(translationKeys.checkIn.guestDetails)}
                        </h3>
                        <div className="p-4 rounded-xl bg-card border shadow-sm">
                            <div className="flex items-start gap-3">
                                <Avatar className="w-10 h-10 border shadow-sm">
                                    <AvatarImage
                                        src={booking.travelerProfileImage}
                                        alt={booking.guestName}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                        {booking.guestName
                                            .charAt(0)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">
                                        {booking.guestName}
                                    </p>
                                    <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                                        <Mail className="w-3.5 h-3.5" />
                                        <span>
                                            {booking.travelerEmail ||
                                                "No email provided"}
                                        </span>
                                    </div>
                                    <div className="mt-2">
                                        <Badge
                                            variant="secondary"
                                            className="bg-green-100/50 text-green-700 hover:bg-green-100 border-green-200"
                                        >
                                            <CheckCircle2 className="w-3 h-3 mr-1" />
                                            Checked In
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Summary */}
                    <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2 text-primary">
                            <Calendar className="w-4 h-4" />
                            {t(translationKeys.checkIn.bookingSummary)}
                        </h3>
                        <div className="p-4 rounded-xl bg-card border shadow-sm space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium">
                                        {booking.roomVariantName}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Room {booking.roomNumber}
                                    </p>
                                </div>
                                <BedDouble className="w-5 h-5 text-muted-foreground" />
                            </div>

                            <div className="pt-3 border-t grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        {t(
                                            translationKeys.hotelBookingListing
                                                .checkIn
                                        )}
                                    </p>
                                    <p className="font-medium">
                                        {new Date(
                                            booking.checkInDate
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        {t(
                                            translationKeys.hotelBookingListing
                                                .checkOut
                                        )}
                                    </p>
                                    <p className="font-medium">
                                        {new Date(
                                            booking.checkOutDate
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                    <LogOut className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-medium text-blue-900">
                            Ready to check out?
                        </h4>
                        <p className="text-sm text-blue-700 mt-1">
                            This will mark the booking as completed and free up
                            Room {booking.roomNumber} for future bookings.
                        </p>
                    </div>
                </div>

                {checkOutError && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Check-in Failed</AlertTitle>
                        <AlertDescription>
                            {checkOutError.message}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isCheckingOut}
                    >
                        {t(translationKeys.checkIn.cancel)}
                    </Button>
                    <Button
                        onClick={handleCheckOut}
                        disabled={isCheckingOut}
                        className="min-w-[140px]"
                    >
                        {isCheckingOut ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                {t(translationKeys.checkIn.checkingOut)}
                            </>
                        ) : (
                            t(translationKeys.checkIn.confirmCheckOut)
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
