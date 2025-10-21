import { ROLES as ROLE_VALUES } from "@domain/constants/roles";
import { ObjectId, Schema } from "mongoose";
import { ROLES } from "@domain/types/roles";

const vehicleSchema = new Schema({
  model: String,
  type: String,
  registrationNumber: String,
  images: [String],
});

const cabDetailsSchema = new Schema({
  baseLocation: String,
  vehicleDetails: vehicleSchema,
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
  profile_image?: string;
  is_verified: boolean;
  verfication_id_image?: string;
  cabDetails: {
    vehicleDetails?: {
      model: string;
      type: string;
      registrationNumber: string;
      images: string[];
    };
    baseLocation?: string;
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
  profile_image: {
    type: String,
  },
  is_verified: {
    type: Boolean,
    default: true,
  },
  verfication_id_image: {
    type: String,
  },
  cabDetails: cabDetailsSchema,
  createdAt: {
    type: Date,
    default: new Date(),
    immutable: true,
  },
  lastLogin: {
    type: Date,
  },
});
