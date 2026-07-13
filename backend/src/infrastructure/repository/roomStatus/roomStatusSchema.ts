import { RoomVariantStatus } from "@domain/enums/roomVariantStatus";
import { Schema, Types } from "mongoose";

export interface IRoomStatusDocument {
  _id: Types.ObjectId;
  roomVariantId: string;
  roomNumber: number;
  status: RoomVariantStatus;
  reason: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const roomStatusSchema = new Schema<IRoomStatusDocument>({
  roomVariantId: { type: String, required: true },
  roomNumber: { type: Number, required: true },
  status: { type: String, required: true },
  reason: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true, expires: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
