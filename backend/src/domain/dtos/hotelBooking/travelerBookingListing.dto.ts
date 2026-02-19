import { BOOKING_STATUS } from "@domain/enums/bookingStatus";
import { HotelBookingEntity } from "@domain/entities/hotelBooking/hotelBooking.entity";

interface Bookings {
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
  bookings: Bookings[];
  pageNo: number;
}

export interface IBookingWithHotelAggregation {
  bookings: (HotelBookingEntity & {
    hotel: { name: string; coverImage: string; address: { city: string } };
  })[];
  pageNo: number;
}
