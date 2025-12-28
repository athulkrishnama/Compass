import { ROLES as ROLE_VALUES } from "@domain/enums/roles";
import { ObjectId, Schema } from "mongoose";
import { ROLES } from "@domain/types/roles";
import { VERIFICATION_STATUS } from "@domain/types/verficationStatus";
import { VERIFICATION_STATUSES } from "@domain/enums/verificationStatus";

export interface IUserDocument extends Document {
  _id: ObjectId;
  email: string;
  password?: string;
  googleId?: string;
  is_blocked: boolean;
  full_name: string;
  mobile?: string;
  date_of_birth: Date;
  role: ROLES;
  createdAt: Date;
  lastLogin: Date;
  profile_image?: string;
  is_verified: VERIFICATION_STATUS;
  verfication_id_image?: string;
  rejection_reason?: string;
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
  date_of_birth: {
    type: Date,
  },
  role: {
    type: String,
    enum: Object.values(ROLE_VALUES),
  },
  profile_image: {
    type: String,
  },
  rejection_reason: {
    type: String,
  },
  is_verified: {
    type: String,
    enum: Object.values(VERIFICATION_STATUSES),
    default: VERIFICATION_STATUSES.NOT_SUBMITTED,
  },
  verfication_id_image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
    immutable: true,
  },
  lastLogin: {
    type: Date,
  },
});
