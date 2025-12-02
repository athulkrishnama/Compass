interface vehicle {
  model: string;
  type: string;
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
