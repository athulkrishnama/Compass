import { inject, injectable } from "tsyringe";
import {
  ICheckCabReviewEligibilityUseCase,
  ICheckCabReviewEligibilityResult,
} from "@application/interfaces/useCase/cabReview/checkCabReviewEligibilityUseCase.interface";
import { ICabReviewRepo } from "@application/interfaces/repository/cabReview/cabReview.repo.interface";
import { IRideRepo } from "@application/interfaces/repository/ride/ride.repo.interface";
import { RIDE_STATUSES } from "@domain/types/rideStatus";
import { PAYMENT_STATUS } from "@domain/enums/paymentStatus";

@injectable()
export class CheckCabReviewEligibilityUseCase
  implements ICheckCabReviewEligibilityUseCase
{
  constructor(
    @inject("ICabReviewRepo") private _cabReviewRepo: ICabReviewRepo,
    @inject("IRideRepo") private _rideRepo: IRideRepo,
  ) {}

  async execute(
    rideId: string,
    riderId: string,
  ): Promise<ICheckCabReviewEligibilityResult> {
    const ride = await this._rideRepo.findById(rideId);
    if (!ride || ride.rider_id !== riderId) {
      return { eligible: false, reason: "Ride not found or unauthorized" };
    }

    if (ride.status !== RIDE_STATUSES.COMPLETED) {
      return { eligible: false, reason: "Ride is not completed" };
    }

    if (ride.paymentStatus !== PAYMENT_STATUS.SUCCESS) {
      return { eligible: false, reason: "Payment not completed" };
    }

    const existing = await this._cabReviewRepo.findByRideId(rideId);
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
