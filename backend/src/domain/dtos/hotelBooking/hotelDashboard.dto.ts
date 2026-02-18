import { BOOKING_STATUS } from "@domain/enums/bookingStatus";

export interface IRecentBooking {
  id: string;
  guestName: string;
  roomVariantName: string;
  checkInDate: string;
  checkOutDate: string;
  status: BOOKING_STATUS;
  totalAmount: number;
}

export interface IHotelDashboardResponseDTO {
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
