import { IHotelReviewWithReviewer } from "@application/interfaces/repository/hotelReview/hotelReview.repo.interface";

export interface IGetAllHotelReviewsResult {
  reviews: IHotelReviewWithReviewer[];
  total: number;
}
