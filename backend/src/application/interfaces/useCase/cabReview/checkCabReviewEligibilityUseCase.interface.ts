export interface ICheckCabReviewEligibilityResult {
  eligible: boolean;
  reason?: string;
  alreadyReviewed?: boolean;
}

export interface ICheckCabReviewEligibilityUseCase {
  execute(
    rideId: string,
    riderId: string,
  ): Promise<ICheckCabReviewEligibilityResult>;
}
