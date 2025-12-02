import { ROLES } from "@domain/types/roles";
import { VERIFICATION_STATUS } from "@domain/types/verficationStatus";

export interface UserEntity {
  _id?: string;
  email: string;
  role: ROLES;
  full_name: string;
  password?: string;
  googleId?: string;
  mobile?: string;
  is_blocked: boolean;
  profile_image?: string;
  is_verified: VERIFICATION_STATUS;
  rejection_reason?: string;
  verfication_id_image?: string;
  createdAt?: Date;
  lastLogin?: Date;
}
