import { BOOKING_STATUS } from "@domain/enums/bookingStatus";
import { PAYMENT_STATUS } from "@domain/enums/paymentStatus";

export interface HotelBookingEntity {
  _id?: string;
  hotelId: string;
  travelerId: string;
  roomVariantId: string;
  roomNumber?: string;
  checkinDate: Date;
  checkoutDate: Date;
  totalAmount: number;
  paymentIntendId: string;
  paymentStatus: PAYMENT_STATUS;
  bookingStatus: BOOKING_STATUS;
  isWalkIn: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
