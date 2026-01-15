import { model } from "mongoose";
import { roomSchema, IRoomDocument } from "../schemas/roomSchema";

export const roomModel = model<IRoomDocument>("room", roomSchema);
