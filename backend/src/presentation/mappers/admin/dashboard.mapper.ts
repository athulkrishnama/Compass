import { IGetAdminDashboardStatsResponseDTO } from "../../../domain/dtos/admin/dashboard.dto";

export class DashboardMapper {
  static toDTO(
    data: IGetAdminDashboardStatsResponseDTO,
  ): IGetAdminDashboardStatsResponseDTO {
    return data;
  }
}
