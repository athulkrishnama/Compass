import { IGetOwnerHotelReviewsResult } from "@domain/dtos/hotelReview/getOwnerHotelReviews.dto";

export interface IGetOwnerHotelReviewsUseCase {
  execute(
    userId: string,
    page: number,
    limit: number,
  ): Promise<IGetOwnerHotelReviewsResult>;
}
