export interface IGetCabDashboardStatsUseCase {
  execute(
    driverId: string,
    filter: {
      type: "weekly" | "monthly" | "yearly";
      year?: number;
      month?: number;
    },
  ): Promise<{
    cards: {
      todayEarnings: number;
      todayTrips: number;
      totalEarnings: number;
      totalDistance: number;
      averageRating: number;
      totalReviews: number;
    };
    charts: {
      earningsTrends: { name: string; earnings: number; trips: number }[];
      tripStatusDistribution: { name: string; value: number }[];
      ratingDistribution: { name: string; value: number }[];
    };
  }>;
}
