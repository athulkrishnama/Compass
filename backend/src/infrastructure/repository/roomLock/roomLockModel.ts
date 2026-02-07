import { model } from "mongoose";
import { roomLockSchema, IRoomLockDocument } from "./roomLockSchema";

export const roomLockModel = model<IRoomLockDocument>(
  "RoomLock",
  roomLockSchema,
);
