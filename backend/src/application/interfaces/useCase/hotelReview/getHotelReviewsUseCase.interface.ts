import { IGetHotelReviewsResult } from "@domain/dtos/hotelReview/getHotelReviews.dto";

export interface IGetHotelReviewsUseCase {
  execute(
    hotelId: string,
    page: number,
    limit: number,
  ): Promise<IGetHotelReviewsResult>;
}
