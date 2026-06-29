import { ICheckHotelReviewEligibilityResult } from "@domain/dtos/hotelReview/checkHotelReviewEligibility.dto";

export interface ICheckHotelReviewEligibilityUseCase {
  execute(
    bookingId: string,
    reviewerId: string,
  ): Promise<ICheckHotelReviewEligibilityResult>;
}
