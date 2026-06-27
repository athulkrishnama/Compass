import { inject, injectable } from "tsyringe";
import { ICreateCabReviewUseCase } from "@application/interfaces/useCase/cabReview/createCabReviewUseCase.interface";
import { ICreateCabReviewDTO } from "@domain/dtos/cabReview/createCabReview.dto";
import { ICabReviewRepo } from "@application/interfaces/repository/cabReview/cabReview.repo.interface";
import { IRideRepo } from "@application/interfaces/repository/ride/ride.repo.interface";
import { ICabRepo } from "@application/interfaces/repository/cab/cab.repo.interface";
import {
  ConflictException,
  InvalidOperationException,
  ResourceNotFoundException,
} from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { RIDE_STATUSES } from "@domain/types/rideStatus";
import { PAYMENT_STATUS } from "@domain/enums/paymentStatus";

@injectable()
export class CreateCabReviewUseCase implements ICreateCabReviewUseCase {
  constructor(
    @inject("ICabReviewRepo") private _cabReviewRepo: ICabReviewRepo,
    @inject("IRideRepo") private _rideRepo: IRideRepo,
    @inject("ICabRepo") private _cabRepo: ICabRepo,
  ) {}

  async execute(data: ICreateCabReviewDTO): Promise<void> {
    const ride = await this._rideRepo.findById(data.rideId);
    if (!ride) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.RIDE_NOT_FOUND,
      );
    }

    if (ride.rider_id !== data.riderId) {
      throw new InvalidOperationException(
        INTERNAL_ERROR_MESSAGES.NOT_AUTHORIZED_TO_REVIEW_RIDE,
      );
    }

    if (ride.status !== RIDE_STATUSES.COMPLETED) {
      throw new InvalidOperationException(
        INTERNAL_ERROR_MESSAGES.RIDE_MUST_BE_COMPLETED,
      );
    }

    if (ride.paymentStatus !== PAYMENT_STATUS.SUCCESS) {
      throw new InvalidOperationException(
        INTERNAL_ERROR_MESSAGES.RIDE_PAYMENT_MUST_BE_COMPLETED,
      );
    }

    const existing = await this._cabReviewRepo.findByRideId(data.rideId);
    if (existing) {
      throw new ConflictException(
        INTERNAL_ERROR_MESSAGES.ALREADY_REVIEWED_RIDE,
      );
    }

    if (!ride.driver_id) {
      throw new InvalidOperationException(
        INTERNAL_ERROR_MESSAGES.NO_DRIVER_ASSIGNED,
      );
    }

    const cab = await this._cabRepo.findByUserId(ride.driver_id);
    if (!cab || !cab._id) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.DRIVER_CAB_NOT_FOUND,
      );
    }

    await this._cabReviewRepo.create({
      rideId: data.rideId,
      riderId: data.riderId,
      driverId: ride.driver_id,
      cabId: cab._id,
      rating: data.rating,
      review: data.review,
    });

    const prevAvg = cab.averageRating ?? 0;
    const prevTotal = cab.totalReviews ?? 0;
    const newTotal = prevTotal + 1;
    const newAvg = (prevAvg * prevTotal + data.rating) / newTotal;

    await this._cabRepo.updateRating(
      cab._id,
      Math.round(newAvg * 10) / 10,
      newTotal,
    );
  }
}
