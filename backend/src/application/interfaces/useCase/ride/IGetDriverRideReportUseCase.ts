import {
  IDriverRideReportRequestDTO,
  IDriverRideReportResponseDTO,
} from "@domain/dtos/ride/driverRideReport.dto";

export interface IGetDriverRideReportUseCase {
  execute(
    params: IDriverRideReportRequestDTO,
  ): Promise<IDriverRideReportResponseDTO>;
}
