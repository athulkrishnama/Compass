import { Document, Types, Schema } from "mongoose";
import { RIDE_STATUS, RideStatus } from "@domain/types/rideStatus";
import { VEHICLE_TYPES, VehicleType } from "@domain/types/vehicleType";

export interface IRideDocument extends Document {
  _id: Types.ObjectId;
  rider_id: Types.ObjectId;
  driver_id?: Types.ObjectId;
  fare_estimate_id: Types.ObjectId;
  pickup_coordinates: {
    type: string;
    coordinates: [number, number];
  };
  drop_coordinates: {
    type: string;
    coordinates: [number, number];
  };
  cab_type: VehicleType;
  fare_snapshot: {
    cab_type: VehicleType;
    total_fare: number;
    selected_at: Date;
  };
  status: RideStatus;
  current_attempt_id?: string;
  attempted_driver_ids: string[];
  current_radius_km: number;
  actual_distance_km?: number;
  actual_duration_minutes?: number;
  final_fare?: number;
  timeline: {
    event: string;
    actor?: string;
    timestamp: Date;
  }[];
  payment_id?: string;
  created_at: Date;
  updated_at: Date;
}

export const rideSchema = new Schema<IRideDocument>({
  rider_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  driver_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  fare_estimate_id: {
    type: Schema.Types.ObjectId,
    ref: "Fare",
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
  cab_type: {
    type: String,
    enum: VEHICLE_TYPES,
    required: true,
  },
  fare_snapshot: {
    cab_type: { type: String, enum: VEHICLE_TYPES, required: true },
    total_fare: { type: Number, required: true },
    selected_at: { type: Date, required: true },
  },
  status: {
    type: String,
    enum: RIDE_STATUS,
    required: true,
    default: "SEARCHING",
  },
  current_attempt_id: {
    type: String,
    required: false,
  },
  attempted_driver_ids: [
    {
      type: String,
    },
  ],
  current_radius_km: {
    type: Number,
    required: true,
    default: 0,
  },
  actual_distance_km: {
    type: Number,
    required: false,
  },
  actual_duration_minutes: {
    type: Number,
    required: false,
  },
  final_fare: {
    type: Number,
    required: false,
  },
  timeline: [
    {
      event: { type: String, required: true },
      actor: { type: String, required: false },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  payment_id: {
    type: String,
    required: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

rideSchema.index({ pickup_coordinates: "2dsphere" });
rideSchema.index({ drop_coordinates: "2dsphere" });
rideSchema.index({ rider_id: 1 });
rideSchema.index({ driver_id: 1 });
rideSchema.index({ status: 1 });

rideSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});
