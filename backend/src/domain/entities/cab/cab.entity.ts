import { VehicleType } from "@domain/types/vehicleType";

interface vehicle {
  model: string;
  type: VehicleType;
  registrationNumber: string;
  images: string[];
}

export interface CabEntity {
  _id?: string;
  userId: string;
  isOnline: boolean;
  active_ride_id?: string;
  vehicleDetails?: vehicle;
  baseLocation?: {
    city: string;
    coordinates: [number, number];
  };
  averageRating?: number;
  totalReviews?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
