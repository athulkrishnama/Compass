import { PaymentStatus } from "@/enums/paymentStatus";
import { BookingStatus } from "@/enums/bookingStatus";

export interface Booking {
    _id: string;
    userId: string;
    hotelId: string;
    roomVariantId: string;
    checkInDate: string;
    checkOutDate: string;
    guestCount: number;
    totalAmount: number;
    paymentStatus: PaymentStatus;
    bookingStatus: BookingStatus;
    paymentIntendId: string;
    createdAt: string;
    updatedAt: string;
}

export enum BookingStatusResponseStatus {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    TIMEOUT = "TIMEOUT",
}

export interface BookingStatusResponse {
    status: BookingStatusResponseStatus;
}
