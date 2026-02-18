export enum BOOKING_STATUS {
    CONFIRMED = "CONFIRMED",
    CHECKED_IN = "CHECKED_IN",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED",
}

interface IBooking {
    id: string;
    hotelName: string;
    coverImage: string;
    city: string;
    checkInDate: string;
    checkOutDate: string;
    totalAmount: number;
    status: BOOKING_STATUS;
}

export interface ITravelerBookingListingResponseDTO {
    bookings: IBooking[];
    pageNo: number;
}

export interface IBookingDetailsResponseDTO {
    id: string;
    bookingStatus: string;
    paymentStatus: string;
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
}
