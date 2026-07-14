import { IAdminCabReportResponseDTO } from "@domain/dtos/ride/driverRideReport.dto";

import { IAdminCabReportRequestDTO } from "@domain/dtos/ride/driverRideReport.dto";

export interface IGetAdminCabReportUseCase {
  execute(
    params: IAdminCabReportRequestDTO,
  ): Promise<IAdminCabReportResponseDTO>;
}
