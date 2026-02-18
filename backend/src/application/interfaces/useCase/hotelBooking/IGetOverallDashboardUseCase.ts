import { IOverallDashboardResponseDTO } from "@domain/dtos/hotelBooking/overallDashboard.dto";

export interface IGetOverallDashboardUseCase {
  execute(userId: string): Promise<IOverallDashboardResponseDTO>;
}
