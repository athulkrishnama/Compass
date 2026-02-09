import { model } from "mongoose";
import { roomSchema } from "./roomSchema";

export const roomModel = model("room", roomSchema);
