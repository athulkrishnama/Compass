import { model } from "mongoose";
import { IRoomStatusDocument, roomStatusSchema } from "./roomStatusSchema";

export const roomStatusModel = model<IRoomStatusDocument>(
  "RoomStatus",
  roomStatusSchema,
);
