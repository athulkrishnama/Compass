import { CabReviewEntity } from "@domain/entities/cabReview/cabReview.entity";

export interface IGetAllCabReviewsResult {
  reviews: CabReviewEntity[];
  total: number;
}
