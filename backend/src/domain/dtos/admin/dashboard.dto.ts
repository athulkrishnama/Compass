export interface IGetAdminDashboardStatsRequestDTO {
  type: "weekly" | "monthly" | "yearly";
  year?: number;
}

export interface IGetAdminDashboardStatsResponseDTO {
  cards: {
    totalUsers: number;
    totalHotels: number;
    totalCabs: number;
    totalBookings: number;
    totalRevenue: number;
  };
  charts: {
    bookingTrends: { name: string; bookings: number; revenue: number }[];
    topHotels: { name: string; bookings: number }[];
    bookingStatusDistribution: { name: string; value: number }[];
    cabRideTrends: { name: string; trips: number; earnings: number }[];
    cabTypeDistribution: { name: string; value: number }[];
    cabRideStatusDistribution: { name: string; value: number }[];
  };
}
