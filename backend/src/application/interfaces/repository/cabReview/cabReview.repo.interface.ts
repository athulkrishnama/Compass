import { CabReviewEntity } from "@domain/entities/cabReview/cabReview.entity";
import { IBaseRepository } from "@application/interfaces/repository/base/base.repo.interface";

export interface ICabReviewFilters {
  rating?: number;
  driverId?: string;
  riderId?: string;
  fromDate?: Date;
  toDate?: Date;
  search?: string;
}

export interface ICabReviewRepo extends IBaseRepository<CabReviewEntity> {
  findByRideId(rideId: string): Promise<CabReviewEntity | null>;
  findByDriverId(
    driverId: string,
    page: number,
    limit: number,
  ): Promise<{ reviews: CabReviewEntity[]; total: number }>;
  findAll(
    filters: ICabReviewFilters,
    page: number,
    limit: number,
  ): Promise<{ reviews: CabReviewEntity[]; total: number }>;
  getRatingDistribution(
    driverId: string,
  ): Promise<{ name: string; value: number }[]>;
}
