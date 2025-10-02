import { ROLES } from "@domain/types/roles";

interface TravelerDetails {
  profile_image?: string;
}

interface HotelDetails {
  hotel_name: string;
  description: string;
  images: string[];
  is_verified: boolean;
  verfication_id_image: string;
}

interface vehicle {
  model: string;
  type: string;
  registrationNumber: string;
  images: string[];
}

export interface CabDetails {
  is_verified: boolean;
  dob?: Date;
  driving_licence_image?: string;
  vehicleDetails?: vehicle;
  baseLocation?: string;
}

export interface UserEntity {
  _id: string;
  email: string;
  role: ROLES;
  full_name: string;
  password: string;
  mobile?: string;
  is_blocked: boolean;
  travelerDetails: TravelerDetails;
  hotelDetails: HotelDetails;
  cabDetails: CabDetails;
  createdAt: Date;
  lastLogin: Date;
}
