import { inject, injectable } from "tsyringe";
import { ICreateHotelReviewUseCase } from "@application/interfaces/useCase/hotelReview/createHotelReviewUseCase.interface";
import { ICreateHotelReviewDTO } from "@domain/dtos/hotelReview/createHotelReview.dto";
import { IHotelReviewRepo } from "@application/interfaces/repository/hotelReview/hotelReview.repo.interface";
import { IHotelBookingRepo } from "@application/interfaces/repository/hotelBooking/hotelBooking.repo.interface";
import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";

import { BOOKING_STATUS } from "@domain/enums/bookingStatus";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import {
  ConflictException,
  InvalidOperationException,
  ResourceNotFoundException,
} from "@application/constants/Exceptions";
import { computeOverallRating } from "@utils/computeOverallRating";

@injectable()
export class CreateHotelReviewUseCase implements ICreateHotelReviewUseCase {
  constructor(
    @inject("IHotelReviewRepo") private _hotelReviewRepo: IHotelReviewRepo,
    @inject("IHotelBookingRepo") private _hotelBookingRepo: IHotelBookingRepo,
    @inject("IHotelRepo") private _hotelRepo: IHotelRepo,
  ) {}

  async execute(data: ICreateHotelReviewDTO): Promise<void> {
    const booking = await this._hotelBookingRepo.findById(data.bookingId);
    if (!booking) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.BOOKING_NOT_FOUND,
      );
    }

    if (booking.travelerId !== data.reviewerId) {
      throw new InvalidOperationException(
        INTERNAL_ERROR_MESSAGES.NOT_AUTHORIZED_TO_REVIEW_BOOKING,
      );
    }

    if (booking.bookingStatus !== BOOKING_STATUS.COMPLETED) {
      throw new InvalidOperationException(
        INTERNAL_ERROR_MESSAGES.BOOKING_MUST_BE_COMPLETED,
      );
    }

    const existing = await this._hotelReviewRepo.findByBookingId(
      data.bookingId,
    );
    if (existing) {
      throw new ConflictException(
        INTERNAL_ERROR_MESSAGES.ALREADY_REVIEWED_BOOKING,
      );
    }

    const overallRating = computeOverallRating(data.ratings);

    await this._hotelReviewRepo.create({
      bookingId: data.bookingId,
      hotelId: booking.hotelId,
      reviewerId: data.reviewerId,
      ratings: data.ratings,
      comment: data.comment,
      overallRating,
    });

    const hotel = await this._hotelRepo.findById(booking.hotelId);
    const prevAvg = hotel?.averageRating ?? 0;
    const prevTotal = hotel?.totalReviews ?? 0;
    const newTotal = prevTotal + 1;
    const newAvg = (prevAvg * prevTotal + overallRating) / newTotal;

    await this._hotelRepo.updateRating(
      booking.hotelId,
      Math.round(newAvg * 10) / 10,
      newTotal,
    );
  }
}
