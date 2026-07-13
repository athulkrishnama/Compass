import { inject, injectable } from "tsyringe";
import { ICabRepo } from "@application/interfaces/repository/cab/cab.repo.interface";
import { IRideRepo } from "@application/interfaces/repository/ride/ride.repo.interface";
import { ICabReviewRepo } from "@application/interfaces/repository/cabReview/cabReview.repo.interface";
import { IGetCabDashboardStatsUseCase } from "@application/interfaces/useCase/cab/getCabDashboardStatsUseCase.interface";

@injectable()
export class GetCabDashboardStatsUseCase
  implements IGetCabDashboardStatsUseCase
{
  constructor(
    @inject("ICabRepo") private cabRepo: ICabRepo,
    @inject("IRideRepo") private rideRepo: IRideRepo,
    @inject("ICabReviewRepo") private cabReviewRepo: ICabReviewRepo,
  ) {}

  async execute(
    driverId: string,
    filter: {
      type: "weekly" | "monthly" | "yearly";
      year?: number;
      month?: number;
    },
  ) {
    const cabDetails = await this.cabRepo.findByUserId(driverId);

    const [rideStats, ratingDistribution] = await Promise.all([
      this.rideRepo.getDriverDashboardStats(driverId, filter),
      this.cabReviewRepo.getRatingDistribution(driverId),
    ]);

    return {
      cards: {
        todayEarnings: rideStats.todayEarnings,
        todayTrips: rideStats.todayTrips,
        totalEarnings: rideStats.totalEarnings,
        totalDistance: rideStats.totalDistance,
        averageRating: cabDetails?.averageRating || 0,
        totalReviews: cabDetails?.totalReviews || 0,
      },
      charts: {
        earningsTrends: rideStats.earningsTrends,
        tripStatusDistribution: rideStats.tripStatusDistribution,
        ratingDistribution: ratingDistribution,
      },
    };
  }
}
