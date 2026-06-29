import { inject, injectable } from "tsyringe";
import { ICheckHotelReviewEligibilityUseCase } from "@application/interfaces/useCase/hotelReview/checkHotelReviewEligibilityUseCase.interface";
import { ICheckHotelReviewEligibilityResult } from "@domain/dtos/hotelReview/checkHotelReviewEligibility.dto";
import { IHotelReviewRepo } from "@application/interfaces/repository/hotelReview/hotelReview.repo.interface";
import { IHotelBookingRepo } from "@application/interfaces/repository/hotelBooking/hotelBooking.repo.interface";
import { BOOKING_STATUS } from "@domain/enums/bookingStatus";

@injectable()
export class CheckHotelReviewEligibilityUseCase
  implements ICheckHotelReviewEligibilityUseCase
{
  constructor(
    @inject("IHotelReviewRepo") private _hotelReviewRepo: IHotelReviewRepo,
    @inject("IHotelBookingRepo") private _hotelBookingRepo: IHotelBookingRepo,
  ) {}

  async execute(
    bookingId: string,
    reviewerId: string,
  ): Promise<ICheckHotelReviewEligibilityResult> {
    const booking = await this._hotelBookingRepo.findById(bookingId);
    if (!booking || booking.travelerId !== reviewerId) {
      return { eligible: false, reason: "Booking not found or unauthorized" };
    }

    if (booking.bookingStatus !== BOOKING_STATUS.COMPLETED) {
      return { eligible: false, reason: "Booking is not completed" };
    }

    const existing = await this._hotelReviewRepo.findByBookingId(bookingId);
    if (existing) {
      return {
        eligible: false,
        alreadyReviewed: true,
        reason: "Already reviewed",
      };
    }

    return { eligible: true };
  }
}
