import { Document, Types, Schema } from "mongoose";

export interface IHotelDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  description: string;
  coverImage: string;
  images: string[];
  address: {
    country: string;
    city: string;
    landMark: string;
    pinCode: string;
    coordinates: {
      type: string;
      coordinates: [number, number];
    };
  };
}

export const hotelSchema = new Schema<IHotelDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
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
  address: {
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    landMark: {
      type: String,
      required: true,
    },
    pinCode: {
      type: String,
      required: true,
    },
    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
});

hotelSchema.index({ "address.coordinates": "2dsphere" });
