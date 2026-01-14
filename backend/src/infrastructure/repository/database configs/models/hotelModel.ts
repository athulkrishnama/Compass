import { Model } from "mongoose";
import { hotelSchema } from "../schemas/hotelSchema";

export const hotelModel = new Model("hotel", hotelSchema);
