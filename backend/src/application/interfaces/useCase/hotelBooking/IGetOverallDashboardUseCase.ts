import { IOverallDashboardResponseDTO } from "@domain/dtos/hotelBooking/overallDashboard.dto";

export interface IGetOverallDashboardUseCase {
  execute(
    userId: string,
    filter: {
      type: "weekly" | "monthly" | "yearly";
      year?: number;
      month?: number;
    },
  ): Promise<IOverallDashboardResponseDTO>;
}
