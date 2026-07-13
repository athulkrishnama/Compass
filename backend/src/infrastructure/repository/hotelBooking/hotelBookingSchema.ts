import { BOOKING_STATUS } from "@domain/enums/bookingStatus";
import { PAYMENT_STATUS } from "@domain/enums/paymentStatus";
import { REFUND_STATUS } from "@domain/enums/refundStatus";
import { Schema, Types } from "mongoose";

export interface IHotelBookingDocument extends Document {
  _id: Types.ObjectId;
  bookingId: string;
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

export const hotelBookingSchema = new Schema<IHotelBookingDocument>({
  bookingId: { type: String, required: true, unique: true },
  hotelId: { type: String, required: true },
  travelerId: { type: String, required: true },
  roomVariantId: { type: String, required: true },
  numberOfRooms: { type: Number, required: true, default: 1 },
  roomNumbers: { type: [Number] },
  checkinDate: { type: Date, required: true },
  checkoutDate: { type: Date, required: true },
  totalAmount: { type: Number, required: true },
  paymentIntendId: { type: String, required: true },
  paymentStatus: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.PENDING,
  },
  bookingStatus: {
    type: String,
    enum: Object.values(BOOKING_STATUS),
    default: BOOKING_STATUS.CONFIRMED,
  },
  isWalkIn: {
    type: Boolean,
    default: false,
  },
  refundAmount: { type: Number, default: 0 },
  refundStatus: {
    type: String,
    enum: Object.values(REFUND_STATUS),
    default: REFUND_STATUS.NONE,
  },
  cancelledAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
