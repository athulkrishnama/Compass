import { BOOKING_STATUS } from "@domain/enums/bookingStatus";
import { PAYMENT_STATUS } from "@domain/enums/paymentStatus";
import { REFUND_STATUS } from "@domain/enums/refundStatus";

export interface HotelBookingEntity {
  _id?: string;
  hotelId: string;
  travelerId: string;
  roomVariantId: string;
  numberOfRooms: number;
  roomNumbers?: number[];
  checkinDate: Date;
  checkoutDate: Date;
  totalAmount: number;
  paymentIntendId: string;
  paymentStatus: PAYMENT_STATUS;
  bookingStatus: BOOKING_STATUS;
  isWalkIn: boolean;
  refundAmount?: number;
  refundStatus?: REFUND_STATUS;
  cancelledAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
