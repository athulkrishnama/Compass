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

export interface IOverallDashboardResponseDTO {
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
