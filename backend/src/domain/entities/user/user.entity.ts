import { ROLES } from "@domain/types/roles";
import { VERIFICATION_STATUS } from "@domain/types/verficationStatus";

interface vehicle {
  model: string;
  type: string;
  registrationNumber: string;
  images: string[];
}

export interface CabDetails {
  vehicleDetails?: vehicle;
  baseLocation?: string;
}

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
  verfication_id_image?: string;
  cabDetails?: CabDetails;
  createdAt?: Date;
  lastLogin?: Date;
}
