import { BOOKING_STATUS } from "@domain/enums/bookingStatus";
import { PAYMENT_STATUS } from "@domain/enums/paymentStatus";
import { Schema, Types } from "mongoose";

export interface IHotelBookingDocument extends Document {
  _id: Types.ObjectId;
  hotelId: string;
  travelerId: string;
  roomVariantId: string;
  roomId: string;
  checkinDate: Date;
  checkoutDate: Date;
  totalAmount: number;
  paymentIntendId: string;
  paymentStatus: PAYMENT_STATUS;
  bookingStatus: BOOKING_STATUS;
  createdAt?: Date;
  updatedAt?: Date;
}

export const hotelBookingSchema = new Schema<IHotelBookingDocument>({
  hotelId: { type: String, required: true },
  travelerId: { type: String, required: true },
  roomVariantId: { type: String, required: true },
  roomId: { type: String, required: true },
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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
