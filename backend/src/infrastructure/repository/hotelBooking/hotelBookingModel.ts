import { model } from "mongoose";
import {
  hotelBookingSchema,
  IHotelBookingDocument,
} from "../schemas/hotelBookingSchema";

export const hotelBookingModel = model<IHotelBookingDocument>(
  "HotelBooking",
  hotelBookingSchema,
);
