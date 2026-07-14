import { inject, injectable } from "tsyringe";
import { IGetAdminCabReportPdfUseCase } from "@application/interfaces/useCase/admin/IGetAdminCabReportPdfUseCase";
import { IRideRepo } from "@application/interfaces/repository/ride/ride.repo.interface";
import { IAdminCabReportPdfRequestDTO } from "@domain/dtos/ride/driverRideReport.dto";
import { IPdfGeneratorService } from "@application/interfaces/service/pdfGenerator.service.interface";

@injectable()
export class GetAdminCabReportPdfUseCase
  implements IGetAdminCabReportPdfUseCase
{
  constructor(
    @inject("IRideRepo") private _rideRepo: IRideRepo,
    @inject("IPdfGeneratorService")
    private _pdfGeneratorService: IPdfGeneratorService,
  ) {}

  async execute(params: IAdminCabReportPdfRequestDTO): Promise<Buffer> {
    const items = await this._rideRepo.getAllAdminCabRidesForReport({
      status: params.status,
      search: params.search,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
    });

    return this._pdfGeneratorService.generateCabReportPdfBuffer(
      items,
      "Platform Cab Rides Report",
      true,
    );
  }
}
