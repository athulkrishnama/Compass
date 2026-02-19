import {
  IGetAdminDashboardStatsRequestDTO,
  IGetAdminDashboardStatsResponseDTO,
} from "../../../../domain/dtos/admin/dashboard.dto";

export interface IGetAdminDashboardStatsUseCase {
  execute(
    filter: IGetAdminDashboardStatsRequestDTO,
  ): Promise<IGetAdminDashboardStatsResponseDTO>;
}
