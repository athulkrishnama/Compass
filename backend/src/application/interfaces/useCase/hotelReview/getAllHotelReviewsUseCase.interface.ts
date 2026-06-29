import { IHotelReviewFilters } from "@application/interfaces/repository/hotelReview/hotelReview.repo.interface";

import { IGetAllHotelReviewsResult } from "@domain/dtos/hotelReview/getAllHotelReviews.dto";

export interface IGetAllHotelReviewsUseCase {
  execute(
    filters: IHotelReviewFilters,
    page: number,
    limit: number,
  ): Promise<IGetAllHotelReviewsResult>;
}
