import { IAdminCabReportPdfRequestDTO } from "@domain/dtos/ride/driverRideReport.dto";

export interface IGetAdminCabReportPdfUseCase {
  execute(params: IAdminCabReportPdfRequestDTO): Promise<Buffer>;
}
