import { ICabReviewFilters } from "@application/interfaces/repository/cabReview/cabReview.repo.interface";
import { IGetAllCabReviewsResult } from "@domain/dtos/cabReview/getAllCabReviews.dto";

export interface IGetAllCabReviewsUseCase {
  execute(
    filters: ICabReviewFilters,
    page: number,
    limit: number,
  ): Promise<IGetAllCabReviewsResult>;
}
