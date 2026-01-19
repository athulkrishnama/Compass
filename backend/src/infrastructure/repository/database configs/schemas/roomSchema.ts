import { RoomVariantStatus } from "@domain/enums/roomVariantStatus";
import { Document, Schema, Types } from "mongoose";

export interface IRoomDocument extends Document {
  _id: Types.ObjectId;
  hotelId: string;
  variantId: string;
  roomCode: string;
  floor: number;
  status: RoomVariantStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export const roomSchema = new Schema<IRoomDocument>({
  hotelId: { type: String, required: true },
  variantId: { type: String, required: true },
  roomCode: { type: String, required: true },
  floor: { type: Number, required: true },
  status: { type: String, enum: RoomVariantStatus, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
