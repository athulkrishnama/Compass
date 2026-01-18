import { Document, Types, Schema } from "mongoose";
import { BedType } from "@domain/enums/bedType";
import { RoomAmenity } from "@domain/enums/roomAmenity";
import { RoomVariantStatus } from "@domain/enums/roomVariantStatus";

export interface IRoomVariantDocument extends Document {
  _id: Types.ObjectId;
  hotelId: Types.ObjectId;
  name: string;
  code: string;
  description: string;
  baseOccupancy: number;
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
  status: RoomVariantStatus;
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
    code: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    baseOccupancy: {
      type: Number,
      required: true,
      min: 1,
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
    status: {
      type: String,
      enum: Object.values(RoomVariantStatus),
      default: RoomVariantStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
  },
);

roomVariantSchema.index({ hotelId: 1, code: 1 }, { unique: true });
