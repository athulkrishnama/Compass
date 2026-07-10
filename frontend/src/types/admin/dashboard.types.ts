export interface DashboardCards {
    totalUsers: number;
    totalHotels: number;
    totalCabs: number;
    totalBookings: number;
    totalRevenue: number;
}

export interface BookingTrend {
    name: string; // e.g., "Jan", "Mon", "2024"
    bookings: number;
    revenue: number;
}

export interface TopHotel {
    name: string;
    bookings: number;
}

export interface BookingStatusDistribution {
    name: string;
    value: number;
}

export interface DashboardCharts {
    bookingTrends: BookingTrend[];
    topHotels: TopHotel[];
    bookingStatusDistribution: BookingStatusDistribution[];
    cabRideTrends: { name: string; trips: number; earnings: number }[];
    cabTypeDistribution: { name: string; value: number }[];
    cabRideStatusDistribution: { name: string; value: number }[];
}

export interface DashboardStats {
    cards: DashboardCards;
    charts: DashboardCharts;
}

export interface DashboardFilter {
    type: "weekly" | "monthly" | "yearly";
    year?: number;
}
