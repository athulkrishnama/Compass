import { Document, Types, Schema } from "mongoose";
import { BedType } from "@domain/enums/bedType";
import { RoomAmenity } from "@domain/enums/roomAmenity";

export interface IRoomVariantDocument extends Document {
  _id: Types.ObjectId;
  hotelId: Types.ObjectId;
  name: string;
  roomPrefix: string;
  description: string;
  maxOccupancy: number;
  bedConfig: {
    type: BedType;
    count: number;
  };
  amenities: RoomAmenity[];
  policies: {
    smokingAllowed: boolean;
    petsAllowed: boolean;
    checkInTime: string;
    checkOutTime: string;
  };
  basePrice: number;
  coverImage: string;
  images: string[];
  totalRooms: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const roomVariantSchema = new Schema<IRoomVariantDocument>(
  {
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: "hotel",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    roomPrefix: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    maxOccupancy: {
      type: Number,
      required: true,
      min: 1,
    },
    bedConfig: {
      type: {
        type: String,
        enum: Object.values(BedType),
        required: true,
      },
      count: {
        type: Number,
        required: true,
        min: 1,
      },
    },
    amenities: {
      type: [String],
      enum: Object.values(RoomAmenity),
      default: [],
    },
    policies: {
      smokingAllowed: {
        type: Boolean,
        default: false,
      },
      petsAllowed: {
        type: Boolean,
        default: false,
      },
      checkInTime: {
        type: String,
        required: true,
      },
      checkOutTime: {
        type: String,
        required: true,
      },
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    coverImage: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    totalRooms: {
      type: Number,
      required: true,
      min: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

roomVariantSchema.index({ hotelId: 1, name: 1 }, { unique: true });
