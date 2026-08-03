import { IHotelReviewWithReviewer } from "@application/interfaces/repository/hotelReview/hotelReview.repo.interface";
import { IAspectAverages } from "./getHotelReviews.dto";

export interface IGetOwnerHotelReviewsResult {
  reviews: IHotelReviewWithReviewer[];
  total: number;
  aspectAverages?: IAspectAverages;
}
