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
