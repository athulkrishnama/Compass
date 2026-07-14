import { BookingStatus } from "@/enums/bookingStatus";
import { PaymentStatus } from "@/enums/paymentStatus";

interface IBooking {
    id: string;
    bookingId: string;
    hotelName: string;
    coverImage: string;
    city: string;
    checkInDate: string;
    checkOutDate: string;
    totalAmount: number;
    status: BookingStatus;
}

export interface ITravelerBookingListingResponseDTO {
    bookings: IBooking[];
    pageNo: number;
}

export interface IBookingDetailsResponseDTO {
    id: string;
    bookingId: string;
    bookingStatus: BookingStatus;
    paymentStatus: PaymentStatus;
    createdAt: string;
    checkInDate: string;
    checkOutDate: string;
    totalAmount: number;
    paymentIntendId: string;
    hotel: {
        id: string;
        name: string;
        coverImage: string;
        city: string;
        landMark: string;
    };
    roomVariant: {
        name: string;
        coverImage: string;
        description: string;
        maxOccupancy: number;
        bedConfig: {
            type: string;
            count: number;
        };
        amenities: string[];
        policies: {
            smokingAllowed: boolean;
            petsAllowed: boolean;
            checkInTime: string;
            checkOutTime: string;
        };
    };
    refundAmount?: number;
    refundStatus?: string;
    cancelledAt?: string;
    roomNumbers?: number[];
    numberOfRooms?: number;
    isWalkIn: boolean;
}

export interface IHotelBookingListingItem {
    id: string;
    bookingId: string;
    guestName: string;
    roomVariantName: string;
    roomNumbers: number[];
    numberOfRooms: number;
    checkInDate: string;
    checkOutDate: string;
    totalAmount: number;
    paymentStatus: PaymentStatus;
    bookingStatus: BookingStatus;
    travelerId?: string;
    travelerEmail?: string;
    travelerProfileImage?: string;
}

export interface IHotelBookingListingResponseDTO {
    bookings: IHotelBookingListingItem[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
}
