import { RIDE_STATUSES, RideStatus } from "@domain/types/rideStatus";
import { FareType } from "@domain/types/fareType";
import { RIDE_EVENT_NAMES, RideEventName } from "@domain/types/rideEvent";
import { VEHICLE_TYPES } from "@domain/types/vehicleType";
import { Document, Schema, Types } from "mongoose";
import { ROLES } from "@domain/types/roles";
import { ROLES as RoleValues } from "@domain/enums/roles";
import { PAYMENT_STATUS } from "@domain/enums/paymentStatus";
import { PAYMENT_METHOD } from "@domain/enums/paymentMethod";

export interface IRideDocument extends Document {
  _id: Types.ObjectId;
  rider_id: Types.ObjectId;
  driver_id: Types.ObjectId | null;
  fare_id: Types.ObjectId;
  selected_fare: FareType;
  distance: number;
  time: number;
  pickup_point: {
    type: string;
    coordinates: [number, number];
  };
  dropoff_point: {
    type: string;
    coordinates: [number, number];
  };
  attempted_drivers: Types.ObjectId[];
  attempt_id: string | null;
  otp: string;
  otp_attempts: number;
  status: RideStatus;
  cancelled_by: ROLES | null;
  events: { event_name: RideEventName; actor: string; timestamp: Date }[];
  paymentStatus?: PAYMENT_STATUS;
  paymentMethod?: PAYMENT_METHOD;
  remainingAmount?: number;
}

export const rideSchema = new Schema<IRideDocument>({
  rider_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  driver_id: {
    type: Schema.Types.ObjectId,
    ref: "Driver",
    default: null,
  },
  fare_id: {
    type: Schema.Types.ObjectId,
    ref: "fare",
    required: true,
  },
  selected_fare: {
    cab_type: {
      type: String,
      enum: VEHICLE_TYPES,
      required: true,
    },
    fare: {
      type: Number,
      required: true,
    },
  },
  distance: {
    type: Number,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  pickup_point: {
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
  dropoff_point: {
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
  attempted_drivers: {
    type: [Schema.Types.ObjectId],
    ref: "Driver",
    default: [],
  },
  attempt_id: {
    type: String,
  },
  otp: {
    type: String,
    required: true,
  },
  otp_attempts: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    enum: Object.values(RIDE_STATUSES),
    required: true,
  },
  cancelled_by: {
    type: String,
    enum: [...Object.values(RoleValues), null],
    default: null,
  },
  events: {
    type: [
      {
        event_name: {
          type: String,
          enum: Object.values(RIDE_EVENT_NAMES),
          required: true,
        },
        actor: { type: String, required: true },
        timestamp: { type: Date, required: true },
      },
    ],
    default: [],
  },
  paymentStatus: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.PENDING,
  },
  paymentMethod: {
    type: String,
    enum: Object.values(PAYMENT_METHOD),
  },
  remainingAmount: {
    type: Number,
    default: 0,
  },
});
