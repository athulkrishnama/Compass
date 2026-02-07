import { model } from "mongoose";
import { roomLockSchema, IRoomLockDocument } from "../schemas/roomLockSchema";

export const roomLockModel = model<IRoomLockDocument>(
  "RoomLock",
  roomLockSchema,
);
