import { ROLES as ROLE_VALUES } from "@domain/constants/roles";
import { ObjectId, Schema } from "mongoose";
import { string } from "zod";
import { ROLES } from "@domain/types/roles";

const travelerDetailsSchema = new Schema({
  profile_image: {
    type: String,
    required: true,
  },
});

const vehicleSchema = new Schema({
  model: String,
  type: String,
  registrationNumber: String,
  images: [String],
});

const cabDetailsSchema = new Schema({
  is_verified: {
    type: Boolean,
    default: false,
  },
  dob: Date,
  drivingLicenceImage: string,
  baseLocation: String,
  vehicleDetails: vehicleSchema,
});

const hotelDetailsSchema = new Schema({
  is_verified: {
    type: Boolean,
    default: false,
  },
  verificationId: string,
  hotel_name: String,
  description: String,
  images: [String],
});

export interface IUserDocument extends Document {
  _id: ObjectId;
  email: string;
  password?: string;
  googleId?: string;
  is_blocked: boolean;
  full_name: string;
  mobile: string;
  role: ROLES;
  createdAt: Date;
  lastLogin: Date;
  travelerDetails: {
    profile_image?: string;
  };
  cabDetails: {
    is_verified: boolean;
    dob?: Date;
    driving_licence_image?: string;
    vehicleDetails?: {
      model: string;
      type: string;
      registrationNumber: string;
      images: string[];
    };
    baseLocation?: string;
  };
  hotelDetails: {
    hotel_name: string;
    description: string;
    images: string[];
    is_verified: boolean;
    verfication_id_image: string;
  };
}

export const userSchema = new Schema<IUserDocument>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  googleId: {
    type: String,
  },
  is_blocked: {
    type: Boolean,
    default: false,
  },
  full_name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
  },
  role: {
    type: String,
    enum: Object.values(ROLE_VALUES),
  },
  travelerDetails: travelerDetailsSchema,
  cabDetails: cabDetailsSchema,
  hotelDetails: hotelDetailsSchema,
  createdAt: {
    type: Date,
    default: new Date(),
    immutable: true,
  },
  lastLogin: {
    type: Date,
  },
});
