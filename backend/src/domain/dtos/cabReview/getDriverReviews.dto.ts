import { CabReviewEntity } from "@domain/entities/cabReview/cabReview.entity";

export interface IGetDriverReviewsResult {
  reviews: CabReviewEntity[];
  total: number;
  averageRating: number;
}
