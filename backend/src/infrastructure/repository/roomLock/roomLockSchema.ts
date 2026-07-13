import { Document, Schema, Types } from "mongoose";

export interface IRoomLockDocument extends Document {
  _id: Types.ObjectId;
  roomVariantId: string;
  travelerId: string;
  numberOfRooms: number;
  checkinDate: Date;
  checkoutDate: Date;
  amount: number;
  expiresAt: Date;
  paymentIntentId: string;
}

export const roomLockSchema = new Schema<IRoomLockDocument>({
  roomVariantId: { type: String, required: true },
  travelerId: { type: String, required: true },
  numberOfRooms: { type: Number, required: true, default: 1 },
  checkinDate: { type: Date, required: true },
  checkoutDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  expiresAt: {
    type: Date,
    required: true,
    expires: "1s",
    default: Date.now(),
  },
  paymentIntentId: { type: String, required: true },
});
