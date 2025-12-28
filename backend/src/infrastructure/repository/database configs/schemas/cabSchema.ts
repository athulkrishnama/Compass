import { VehicleType, VEHICLE_TYPES } from "@domain/types/vehicleType";
import { Types, Schema } from "mongoose";

export interface ICabDocument extends Document {
  _id: Types.ObjectId;
  baseLocation?: {
    city: string;
    coordinates: { type: string; coordinates: [number, number] };
  };
  vehicleDetails?: vehicle;
  isOnline: boolean;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface vehicle {
  model: string;
  type: VehicleType;
  registrationNumber: string;
  images: string[];
}

const baseLocationSchema = new Schema({
  city: {
    type: String,
  },
  coordinates: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

export const cabSchema = new Schema<ICabDocument>({
  baseLocation: { type: baseLocationSchema, required: false },
  vehicleDetails: {
    model: {
      type: String,
    },
    type: {
      type: String,
      enum: VEHICLE_TYPES,
    },
    registrationNumber: {
      type: String,
    },
    images: {
      type: [String],
    },
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: String,
    required: true,
    ref: "users",
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

cabSchema.index({ "baseLocation.coordinates": "2dsphere" });
