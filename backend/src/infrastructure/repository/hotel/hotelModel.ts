import { model } from "mongoose";
import { hotelSchema } from "./hotelSchema";

export const hotelModel = model("hotel", hotelSchema);
