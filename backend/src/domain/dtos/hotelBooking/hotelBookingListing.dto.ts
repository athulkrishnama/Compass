import { BOOKING_STATUS } from "@domain/enums/bookingStatus";
import { PAYMENT_STATUS } from "@domain/enums/paymentStatus";

export interface HotelBookingListingItem {
  id: string;
  bookingId: string;
  travelerId: string;
  travelerEmail: string;
  guestName: string;
  roomVariantName: string;
  roomNumbers: number[];
  numberOfRooms: number;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  paymentStatus: PAYMENT_STATUS;
  bookingStatus: BOOKING_STATUS;
}

export interface IHotelBookingListingResponseDTO {
  bookings: HotelBookingListingItem[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

export interface IHotelBookingListingAggregationBooking {
  _id: string;
  bookingId: string;
  hotelId: string;
  travelerId: string;
  roomVariantId: string;
  roomNumbers?: number[];
  numberOfRooms: number;
  checkinDate: Date;
  checkoutDate: Date;
  totalAmount: number;
  paymentStatus: PAYMENT_STATUS;
  bookingStatus: BOOKING_STATUS;
  createdAt?: Date;
  traveler: {
    full_name: string;
    email: string;
    profile_image?: string;
  };
  roomVariant: {
    name: string;
  };
}

export interface IHotelBookingListingAggregation {
  bookings: IHotelBookingListingAggregationBooking[];
  total: number;
}
