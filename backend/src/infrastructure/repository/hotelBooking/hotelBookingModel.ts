import { model } from "mongoose";
import {
  hotelBookingSchema,
  IHotelBookingDocument,
} from "./hotelBookingSchema";

export const hotelBookingModel = model<IHotelBookingDocument>(
  "HotelBooking",
  hotelBookingSchema,
);
