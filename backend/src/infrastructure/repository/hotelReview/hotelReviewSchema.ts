import { Document, Types, Schema } from "mongoose";

export interface IHotelReviewDocument extends Document {
  _id: Types.ObjectId;
  bookingId: string;
  hotelId: string;
  reviewerId: string;
  ratings: {
    hospitality?: number;
    staffFriendliness?: number;
    cleanliness?: number;
    comfort?: number;
    roomQuality?: number;
    safety?: number;
  };
  comment?: string;
  overallRating?: number;
  createdAt: Date;
  updatedAt: Date;
}

const aspectRatingsSchema = new Schema(
  {
    hospitality: { type: Number, min: 1, max: 5 },
    staffFriendliness: { type: Number, min: 1, max: 5 },
    cleanliness: { type: Number, min: 1, max: 5 },
    comfort: { type: Number, min: 1, max: 5 },
    roomQuality: { type: Number, min: 1, max: 5 },
    safety: { type: Number, min: 1, max: 5 },
  },
  { _id: false },
);

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
    ratings: {
      type: aspectRatingsSchema,
      required: true,
    },
    comment: {
      type: String,
      maxlength: 500,
    },
    overallRating: {
      type: Number,
      index: true,
    },
  },
  { timestamps: true },
);
