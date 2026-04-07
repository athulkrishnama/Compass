import { FARE_STATUS } from "@domain/types/fareStatus";
import { VEHICLE_TYPES } from "@domain/types/vehicleType";
import { FareType } from "@domain/types/fareType";
import { Document, Schema, Types } from "mongoose";

export interface IFareDocument extends Document {
    _id: Types.ObjectId
    rider_id: Types.ObjectId
    pickup_location: {
        type: string
        coordinates: [number, number]
    }
    dropoff_location: {
        type: string
        coordinates: [number, number]
    }
    distance: number
    time: number
    created_at: Date
    expires_at: Date
    status: string
    fares: FareType[]
}

export const fareSchema = new Schema<IFareDocument>({
    rider_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    pickup_location: {
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
    dropoff_location: {
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
    distance: {
        type: Number,
        required: true,
    },
    time: {
        type: Number,
        required: true,
    },
    created_at: {
        type: Date,
        required: true,
    },
    expires_at: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: FARE_STATUS,
        required: true,
    },
    fares: {
        type: [{
            cab_type: {
                type: String,
                enum: VEHICLE_TYPES,
                required: true,
            },
            fare: {
                type: Number,
                required: true,
            },
        }],
        required: true,
    },
});


