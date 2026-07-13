import { BookingStatus } from "@/enums/bookingStatus";

export interface IHotelDashboardSummary {
    id: string;
    name: string;
    coverImage: string;
    city: string;
    todayCheckIns: number;
    todayCheckOuts: number;
    activeGuests: number;
    totalRooms: number;
    occupiedRooms: number;
    occupancyRate: number;
}

export interface IOverallDashboardResponse {
    totalHotels: number;
    todayCheckIns: number;
    todayCheckOuts: number;
    activeGuests: number;
    totalRooms: number;
    occupiedRooms: number;
    occupancyRate: number;
    totalRevenue: number;
    hotels: IHotelDashboardSummary[];
    charts: {
        revenueTrends: { name: string; revenue: number; bookings: number }[];
        bookingStatusDistribution: { name: string; value: number }[];
        topHotelsByBookings: { name: string; bookings: number }[];
    };
}

export interface IRecentBooking {
    id: string;
    guestName: string;
    roomVariantName: string;
    checkInDate: string;
    checkOutDate: string;
    status: BookingStatus;
    totalAmount: number;
}

export interface IHotelDashboardResponse {
    hotel: {
        id: string;
        name: string;
        coverImage: string;
        city: string;
    };
    todayCheckIns: number;
    todayCheckOuts: number;
    activeGuests: number;
    totalRooms: number;
    occupiedRooms: number;
    occupancyRate: number;
    totalRevenue: number;
    totalBookings: number;
    recentBookings: IRecentBooking[];
}
