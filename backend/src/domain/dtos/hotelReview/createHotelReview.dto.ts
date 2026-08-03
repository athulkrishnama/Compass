import { IReviewAspectRatings } from "@domain/entities/hotelReview/hotelReview.entity";

export interface ICreateHotelReviewDTO {
  bookingId: string;
  reviewerId: string;
  ratings: IReviewAspectRatings;
  comment?: string;
}
