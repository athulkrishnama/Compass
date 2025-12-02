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
  vehicleDetails?: vehicle;
  baseLocation?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
