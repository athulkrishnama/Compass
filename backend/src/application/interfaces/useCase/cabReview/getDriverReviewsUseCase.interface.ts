import { IGetDriverReviewsResult } from "@domain/dtos/cabReview/getDriverReviews.dto";

export interface IGetDriverReviewsUseCase {
  execute(
    driverId: string,
    page: number,
    limit: number,
  ): Promise<IGetDriverReviewsResult>;
}
