import { BOOKING_STATUS } from "@/types/api/responses/bookingResponse";

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
}

export interface IRecentBooking {
    id: string;
    guestName: string;
    roomVariantName: string;
    checkInDate: string;
    checkOutDate: string;
    status: BOOKING_STATUS;
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
