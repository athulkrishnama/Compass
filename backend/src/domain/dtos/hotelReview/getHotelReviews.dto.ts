import { IHotelReviewWithReviewer } from "@application/interfaces/repository/hotelReview/hotelReview.repo.interface";

export interface IAspectAverages {
  hospitality?: number;
  staffFriendliness?: number;
  cleanliness?: number;
  comfort?: number;
  roomQuality?: number;
  safety?: number;
}

export interface IGetHotelReviewsResult {
  reviews: IHotelReviewWithReviewer[];
  total: number;
  averageRating: number;
  aspectAverages: IAspectAverages;
}
