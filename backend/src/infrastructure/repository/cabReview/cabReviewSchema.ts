import { Document, Types, Schema } from "mongoose";

export interface ICabReviewDocument extends Document {
  _id: Types.ObjectId;
  rideId: string;
  riderId: string;
  driverId: string;
  cabId: string;
  rating: number;
  review: string;
  createdAt: Date;
  updatedAt: Date;
}

export const cabReviewSchema = new Schema<ICabReviewDocument>(
  {
    rideId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    riderId: {
      type: String,
      required: true,
      index: true,
    },
    driverId: {
      type: String,
      required: true,
      index: true,
    },
    cabId: {
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
