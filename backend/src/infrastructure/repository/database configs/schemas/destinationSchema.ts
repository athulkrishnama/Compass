import { ACTIVITY_TYPE } from "@domain/enums/activityType";
import { CURRENCY } from "@domain/enums/currency";
import { DESTINATION_TYPES } from "@domain/enums/destinationType";
import { MONTH } from "@domain/enums/months";
import { WEEKDAY } from "@domain/enums/weekdays";
import { Types, Document, Schema } from "mongoose";

export interface IDestinationDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  tagline: string;
  description: string;
  coverImage: string;
  images: string[];

  country: string;
  city: string;
  pincode: string;
  coordinates: { type: string; coordinates: [number, number] };

  type: DESTINATION_TYPES;
  activities: ACTIVITY_TYPE[];
  bestTimeToVisit: MONTH[];

  isActive: boolean;
  isWheelChairAccessible: boolean;
  isFree: boolean;
  isAlwaysOpen: boolean;

  entryFee?: number;
  currency?: CURRENCY;

  openingTime?: string;
  closingTime?: string;
  closedDays?: WEEKDAY[];

  createdAt?: Date;
  updatedAt?: Date;
}

export const destinationSchema = new Schema<IDestinationDocument>({
  name: {
    type: String,
    required: true,
  },
  tagline: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },

  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  coordinates: {
    type: { type: String, enum: ["Point"], required: true, default: "Point" },
    coordinates: { type: [Number], required: true },
  },

  type: {
    type: String,
    enum: Object.values(DESTINATION_TYPES),
    required: true,
  },
  activities: {
    type: [String],
    enum: Object.values(ACTIVITY_TYPE),
    required: true,
  },
  bestTimeToVisit: {
    type: [String],
    enum: Object.values(MONTH),
    required: true,
  },

  isActive: {
    type: Boolean,
    required: true,
  },
  isWheelChairAccessible: {
    type: Boolean,
    required: true,
  },
  isAlwaysOpen: {
    type: Boolean,
    required: true,
  },

  isFree: {
    type: Boolean,
    required: true,
  },

  entryFee: {
    type: Number,
    required: false,
  },
  currency: {
    type: String,
    enum: Object.values(CURRENCY),
    required: false,
  },
  openingTime: {
    type: String,
    required: false,
  },
  closingTime: {
    type: String,
    required: false,
  },
  closedDays: {
    type: [String],
    enum: Object.values(WEEKDAY),
    required: false,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

destinationSchema.index({ coordinates: "2dsphere" });
