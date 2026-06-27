import { model } from "mongoose";
import { IHotelReviewDocument, hotelReviewSchema } from "./hotelReviewSchema";

export const hotelReviewModel = model<IHotelReviewDocument>(
  "hotelreviews",
  hotelReviewSchema,
);
