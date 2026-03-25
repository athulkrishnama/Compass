import { Document, Types, Schema } from "mongoose";
import { FARE_STATUS, FareStatus } from "@domain/types/fareStatus";
import { VEHICLE_TYPES, VehicleType } from "@domain/types/vehicleType";

export interface IFareDocument extends Document {
  _id: Types.ObjectId;
  rider_id: Types.ObjectId;
  pickup_coordinates: {
    type: string;
    coordinates: [number, number];
  };
  drop_coordinates: {
    type: string;
    coordinates: [number, number];
  };
  distance_km: number;
  duration_minutes: number;
  fare_options: {
    cab_type: VehicleType;
    total_fare: number;
  }[];
  selected_option?: {
    cab_type: VehicleType;
    total_fare: number;
    selected_at: Date;
  };
  status: FareStatus;
  expires_at: Date;
  created_at: Date;
}

export const fareSchema = new Schema<IFareDocument>({
  rider_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  pickup_coordinates: {
    type: { type: String, enum: ["Point"], required: true, default: "Point" },
    coordinates: { type: [Number], required: true },
  },
  drop_coordinates: {
    type: { type: String, enum: ["Point"], required: true, default: "Point" },
    coordinates: { type: [Number], required: true },
  },
  distance_km: {
    type: Number,
    required: true,
  },
  duration_minutes: {
    type: Number,
    required: true,
  },
  fare_options: [
    {
      cab_type: { type: String, enum: VEHICLE_TYPES, required: true },
      total_fare: { type: Number, required: true },
    },
  ],
  selected_option: {
    type: {
      cab_type: { type: String, enum: VEHICLE_TYPES, required: true },
      total_fare: { type: Number, required: true },
      selected_at: { type: Date, required: true },
    },
    required: false,
  },
  status: {
    type: String,
    enum: FARE_STATUS,
    required: true,
    default: "PENDING_SELECTION",
  },
  expires_at: {
    type: Date,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

fareSchema.index({ pickup_coordinates: "2dsphere" });
fareSchema.index({ drop_coordinates: "2dsphere" });
