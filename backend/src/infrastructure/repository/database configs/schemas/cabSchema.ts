import { VehicleType, VEHICLE_TYPES } from "@domain/types/vehicleType";
import { ObjectId, Schema } from "mongoose";

export interface ICabDocument extends Document {
  _id: ObjectId;
  baseLocation?: string;
  vehicleDetails?: vehicle;
  isOnline: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface vehicle {
  model: string;
  type: VehicleType;
  registrationNumber: string;
  images: string[];
}

export const cabSchema = new Schema<ICabDocument>({
  baseLocation: {
    type: String,
  },
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
