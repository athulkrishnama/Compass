import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Loader2,
    Armchair,
    Calendar,
    User,
    Mail,
    AlertCircle,
    CheckCircle2,
    BedDouble,
} from "lucide-react";
import {
    createGetAvailableRoomsQueryOptions,
    createCheckInMutationOptions,
} from "@/queryOptions/bookingQueryOptions";
import Modal from "@/components/shared/modal/Modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import translationKeys from "@/utils/i18n/translationKey";
import type { IHotelBookingListingItem } from "@/types/api/responses/bookingResponse";
import { QUERY_KEYS } from "@/constants/queryKeys/queryKeys";
import { PaymentStatus } from "@/enums/paymentStatus";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CheckInModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking: IHotelBookingListingItem;
    hotelId: string;
}

export default function CheckInModal({
    isOpen,
    onClose,
    booking,
    hotelId,
}: CheckInModalProps) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [selectedRooms, setSelectedRooms] = useState<number[]>([]);

    const {
        data: roomsData,
        isLoading: isLoadingRooms,
        error: roomsError,
    } = useQuery(createGetAvailableRoomsQueryOptions(hotelId, booking.id));

    const availableRooms = roomsData?.availableRooms || [];
    const unavailableRooms = roomsData?.unavailableRooms || [];

    const {
        mutate: checkIn,
        isPending: isCheckingIn,
        error: checkInError,
    } = useMutation({
        ...createCheckInMutationOptions(),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.HOTEL_BOOKINGS],
            });
            onClose();
        },
    });

    const handleCheckIn = () => {
        const roomNumbers =
            selectedRooms.length > 0 ? selectedRooms : undefined;
        checkIn({
            hotelId,
            bookingId: booking.id,
            roomNumbers,
        });
    };

    const isWalkIn = availableRooms.length === 0;

    const nightsCount = Math.ceil(
        (new Date(booking.checkOutDate).getTime() -
            new Date(booking.checkInDate).getTime()) /
            (1000 * 60 * 60 * 24)
    );

    return (
        <Modal isOpen={isOpen} handleClose={onClose}>
            <div className="flex flex-col gap-6 p-4">
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
                        {t(translationKeys.checkIn.checkInManagement)}
                    </h2>
                </div>

                <div className="grid gap-6">
                    <div className="space-y-4 min-w-0">
                        <h3 className="font-semibold flex items-center gap-2 text-primary">
                            <User className="w-4 h-4" />
                            {t(translationKeys.checkIn.guestDetails)}
                        </h3>
                        <div className="p-4 rounded-xl bg-card border shadow-sm overflow-hidden">
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
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium truncate">
                                        {booking.guestName}
                                    </p>
                                    <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground min-w-0">
                                        <Mail className="w-3.5 h-3.5 shrink-0" />
                                        <span className="truncate">
                                            {booking.travelerEmail ||
                                                "No email provided"}
                                        </span>
                                    </div>
                                    <div className="gap-2 mt-2">
                                        {booking.paymentStatus ===
                                        PaymentStatus.SUCCESS ? (
                                            <Badge
                                                variant="secondary"
                                                className="bg-green-100/50 text-green-700 hover:bg-green-100 border-green-200"
                                            >
                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                                {t(
                                                    translationKeys.checkIn
                                                        .paymentVerified
                                                )}
                                            </Badge>
                                        ) : (
                                            <Badge
                                                variant="secondary"
                                                className="bg-yellow-100/50 text-yellow-700 hover:bg-yellow-100 border-yellow-200"
                                            >
                                                <AlertCircle className="w-3 h-3 mr-1" />
                                                {t(
                                                    translationKeys.checkIn
                                                        .paymentPending
                                                )}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

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
                                        {t(translationKeys.checkIn.nightStay, {
                                            count: nightsCount,
                                        })}
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

                <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2 text-primary">
                        <Armchair className="w-4 h-4" />
                        {t(translationKeys.checkIn.assignRoom)}
                    </h3>

                    {isLoadingRooms ? (
                        <div className="h-20 rounded-xl border flex items-center justify-center text-muted-foreground gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {t(translationKeys.checkIn.loadingRooms)}
                        </div>
                    ) : roomsError ? (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>
                                {t(translationKeys.checkIn.error)}
                            </AlertTitle>
                            <AlertDescription>
                                {t(translationKeys.checkIn.fetchRoomsError)}
                            </AlertDescription>
                        </Alert>
                    ) : isWalkIn ? (
                        <Alert className="bg-amber-50 border-amber-200">
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                            <AlertTitle className="text-amber-800">
                                {t(translationKeys.checkIn.noRoomsAvailable)}
                            </AlertTitle>
                            <AlertDescription className="text-amber-700">
                                {t(translationKeys.checkIn.walkInCheckIn)}
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <div className="space-y-2">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-medium">
                                    {t(translationKeys.checkIn.selectRoom)} (
                                    {selectedRooms.length}/
                                    {booking.numberOfRooms || 1})
                                </span>
                            </div>
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                {availableRooms.map((room: number) => {
                                    const isSelected =
                                        selectedRooms.includes(room);
                                    return (
                                        <button
                                            key={room}
                                            onClick={() => {
                                                if (isSelected) {
                                                    setSelectedRooms(
                                                        selectedRooms.filter(
                                                            (r) => r !== room
                                                        )
                                                    );
                                                } else if (
                                                    selectedRooms.length <
                                                    (booking.numberOfRooms || 1)
                                                ) {
                                                    setSelectedRooms([
                                                        ...selectedRooms,
                                                        room,
                                                    ]);
                                                }
                                            }}
                                            className={`h-10 rounded-md border text-sm font-medium transition-colors flex items-center justify-center ${
                                                isSelected
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "bg-background hover:bg-accent hover:text-accent-foreground"
                                            }`}
                                        >
                                            {room}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="flex gap-4 text-xs">
                                <span className="text-green-600 font-medium">
                                    ● {availableRooms.length}{" "}
                                    {t(translationKeys.checkIn.availableRooms)}
                                </span>
                                <span className="text-muted-foreground">
                                    ● {unavailableRooms.length}{" "}
                                    {t(
                                        translationKeys.checkIn.unavailableRooms
                                    )}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {checkInError && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>
                            {t(translationKeys.checkIn.checkInFailed)}
                        </AlertTitle>
                        <AlertDescription>
                            {checkInError.message}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isCheckingIn}
                    >
                        {t(translationKeys.checkIn.cancel)}
                    </Button>
                    <Button
                        onClick={handleCheckIn}
                        disabled={
                            isCheckingIn ||
                            (selectedRooms.length !==
                                (booking.numberOfRooms || 1) &&
                                !isWalkIn)
                        }
                        className="min-w-[140px]"
                    >
                        {isCheckingIn ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                {t(translationKeys.checkIn.checkingIn)}
                            </>
                        ) : (
                            t(translationKeys.checkIn.confirmCheckIn)
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
