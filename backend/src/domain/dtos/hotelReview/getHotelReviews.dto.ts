import { IHotelReviewWithReviewer } from "@application/interfaces/repository/hotelReview/hotelReview.repo.interface";

export interface IGetHotelReviewsResult {
  reviews: IHotelReviewWithReviewer[];
  total: number;
  averageRating: number;
}
