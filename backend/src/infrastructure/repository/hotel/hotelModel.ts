import { model } from "mongoose";
import { hotelSchema } from "../schemas/hotelSchema";

export const hotelModel = model("hotel", hotelSchema);
