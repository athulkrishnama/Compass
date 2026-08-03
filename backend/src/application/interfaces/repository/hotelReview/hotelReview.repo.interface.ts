import { HotelReviewEntity } from "@domain/entities/hotelReview/hotelReview.entity";
import { IBaseRepository } from "@application/interfaces/repository/base/base.repo.interface";

export interface IHotelReviewFilters {
  minRating?: number;
  maxRating?: number;
  hotelId?: string;
  reviewerId?: string;
  fromDate?: Date;
  toDate?: Date;
  search?: string;
}

export interface IHotelReviewWithReviewer extends HotelReviewEntity {
  reviewerName?: string;
}

export interface IHotelReviewRepo extends IBaseRepository<HotelReviewEntity> {
  findByBookingId(bookingId: string): Promise<HotelReviewEntity | null>;
  findByHotelId(
    hotelId: string,
    page: number,
    limit: number,
  ): Promise<{ reviews: IHotelReviewWithReviewer[]; total: number }>;
  findByOwnerHotelIds(
    hotelIds: string[],
    page: number,
    limit: number,
  ): Promise<{ reviews: IHotelReviewWithReviewer[]; total: number }>;
  findAll(
    filters: IHotelReviewFilters,
    page: number,
    limit: number,
  ): Promise<{ reviews: IHotelReviewWithReviewer[]; total: number }>;
}
