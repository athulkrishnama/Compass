import { Document, Types, Schema } from "mongoose";

export interface IHotelReviewDocument extends Document {
  _id: Types.ObjectId;
  bookingId: string;
  hotelId: string;
  reviewerId: string;
  rating: number;
  review: string;
  createdAt: Date;
  updatedAt: Date;
}

export const hotelReviewSchema = new Schema<IHotelReviewDocument>(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    hotelId: {
      type: String,
      required: true,
      index: true,
    },
    reviewerId: {
      type: String,
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      index: true,
    },
    review: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);
