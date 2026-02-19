import { IHotelDashboardResponseDTO } from "@domain/dtos/hotelBooking/hotelDashboard.dto";

export interface IGetHotelDashboardUseCase {
  execute(userId: string, hotelId: string): Promise<IHotelDashboardResponseDTO>;
}
