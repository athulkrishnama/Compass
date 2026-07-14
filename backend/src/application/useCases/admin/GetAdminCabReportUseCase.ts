import { inject, injectable } from "tsyringe";
import { IGetAdminCabReportUseCase } from "@application/interfaces/useCase/admin/IGetAdminCabReportUseCase";
import { IRideRepo } from "@application/interfaces/repository/ride/ride.repo.interface";
import {
  IAdminCabReportResponseDTO,
  IAdminCabReportRequestDTO,
} from "@domain/dtos/ride/driverRideReport.dto";
import { RideMapper } from "@application/mappers/rideMapper";

@injectable()
export class GetAdminCabReportUseCase implements IGetAdminCabReportUseCase {
  constructor(@inject("IRideRepo") private _rideRepo: IRideRepo) {}

  async execute(
    params: IAdminCabReportRequestDTO,
  ): Promise<IAdminCabReportResponseDTO> {
    const { items, total } = await this._rideRepo.getAdminCabReport({
      status: params.status,
      search: params.search,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      pageNo: params.pageNo,
      limit: params.limit,
    });

    return RideMapper.toAdminCabReportResponseDTO(
      items,
      total,
      params.limit,
      params.pageNo,
    );
  }
}
