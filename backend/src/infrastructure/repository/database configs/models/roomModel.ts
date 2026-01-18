import { model } from "mongoose";
import { roomSchema } from "../schemas/roomSchema";

export const roomModel = model("room", roomSchema);
