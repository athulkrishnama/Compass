import { inject, injectable } from "tsyringe";
import { IDriverRideReportPdfRequestDTO } from "@domain/dtos/ride/driverRideReport.dto";
import { IGetDriverRideReportPdfUseCase } from "@application/interfaces/useCase/ride/IGetDriverRideReportPdfUseCase";
import { IRideRepo } from "@application/interfaces/repository/ride/ride.repo.interface";
import { IPdfGeneratorService } from "@application/interfaces/service/pdfGenerator.service.interface";

@injectable()
export class GetDriverRideReportPdfUseCase
  implements IGetDriverRideReportPdfUseCase
{
  constructor(
    @inject("IRideRepo") private _rideRepo: IRideRepo,
    @inject("IPdfGeneratorService")
    private _pdfGeneratorService: IPdfGeneratorService,
  ) {}

  async execute(params: IDriverRideReportPdfRequestDTO): Promise<Buffer> {
    const items = await this._rideRepo.getAllDriverRidesForReport({
      driverId: params.driverId,
      status: params.status,
      search: params.search,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
    });

    return this._pdfGeneratorService.generateCabReportPdfBuffer(
      items,
      "Driver Ride Report",
      false,
    );
  }
}
