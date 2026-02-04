import { Document, Schema, Types } from "mongoose";

export interface IRoomLockDocument extends Document {
  _id: Types.ObjectId;
  roomVariantId: string;
  checkinDate: Date;
  checkoutDate: Date;
  expiresAt: Date;
}

export const roomLockSchema = new Schema<IRoomLockDocument>({
  roomVariantId: { type: String, required: true },
  checkinDate: { type: Date, required: true },
  checkoutDate: { type: Date, required: true },
  expiresAt: {
    type: Date,
    required: true,
    expires: "15m",
    default: Date.now(),
  },
});
