export interface ICabDashboardCards {
    todayEarnings: number;
    todayTrips: number;
    totalEarnings: number;
    totalDistance: number;
    averageRating: number;
    totalReviews: number;
}

export interface IEarningsTrend {
    name: string;
    earnings: number;
    trips: number;
}

export interface ITripStatusDistribution {
    name: string;
    value: number;
}

export interface IRatingDistribution {
    name: string;
    value: number;
}

export interface ICabDashboardResponse {
    cards: ICabDashboardCards;
    charts: {
        earningsTrends: IEarningsTrend[];
        tripStatusDistribution: ITripStatusDistribution[];
        ratingDistribution: IRatingDistribution[];
    };
}

export interface ICabDashboardFilter {
    type: "weekly" | "monthly" | "yearly";
    year?: number;
    month?: number;
}
