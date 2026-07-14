import { IDriverRideReportPdfRequestDTO } from "@domain/dtos/ride/driverRideReport.dto";

export interface IGetDriverRideReportPdfUseCase {
  execute(params: IDriverRideReportPdfRequestDTO): Promise<Buffer>;
}
