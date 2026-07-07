import { RideEntity } from "@domain/entities/ride/ride.entity";
import { IBaseRepository } from "@application/interfaces/repository/base/base.repo.interface";

export interface IRideRepo extends IBaseRepository<RideEntity> {
  fetchCabActiveRide(driver_id: string): Promise<RideEntity | null>;
  fetchRiderPastTrips(
    rider_id: string,
    page: number,
    limit: number,
  ): Promise<{ trips: RideEntity[]; total: number }>;
  fetchDriverPastTrips(
    driver_id: string,
    page: number,
    limit: number,
  ): Promise<{ trips: RideEntity[]; total: number }>;
  fetchRiderActiveRide(rider_id: string): Promise<RideEntity | null>;

  getDriverDashboardStats(
    driverId: string,
    filter: {
      type: "weekly" | "monthly" | "yearly";
      year?: number;
      month?: number;
    },
  ): Promise<{
    todayEarnings: number;
    todayTrips: number;
    totalEarnings: number;
    totalDistance: number;
    earningsTrends: { name: string; earnings: number; trips: number }[];
    tripStatusDistribution: { name: string; value: number }[];
  }>;
}
