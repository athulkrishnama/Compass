import { IHotelReviewWithReviewer } from "@application/interfaces/repository/hotelReview/hotelReview.repo.interface";

export interface IGetOwnerHotelReviewsResult {
  reviews: IHotelReviewWithReviewer[];
  total: number;
}
