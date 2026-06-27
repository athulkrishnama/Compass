export interface CabReviewEntity {
  _id?: string;
  rideId: string;
  riderId: string;
  driverId: string;
  cabId: string;
  rating: number;
  review: string;
  createdAt?: Date;
  updatedAt?: Date;
}
