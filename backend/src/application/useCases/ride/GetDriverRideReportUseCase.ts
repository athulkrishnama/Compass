import { inject, injectable } from "tsyringe";
import { IGetDriverRideReportUseCase } from "@application/interfaces/useCase/ride/IGetDriverRideReportUseCase";
import { IRideRepo } from "@application/interfaces/repository/ride/ride.repo.interface";
import {
  IDriverRideReportResponseDTO,
  IDriverRideReportRequestDTO,
} from "@domain/dtos/ride/driverRideReport.dto";
import { RideMapper } from "@application/mappers/rideMapper";

@injectable()
export class GetDriverRideReportUseCase implements IGetDriverRideReportUseCase {
  constructor(@inject("IRideRepo") private _rideRepo: IRideRepo) {}

  async execute(
    params: IDriverRideReportRequestDTO,
  ): Promise<IDriverRideReportResponseDTO> {
    const { items, total } = await this._rideRepo.getDriverRideReport({
      driverId: params.driverId,
      status: params.status,
      search: params.search,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      pageNo: params.pageNo,
      limit: params.limit,
    });

    return RideMapper.toDriverRideReportResponseDTO(
      items,
      total,
      params.limit,
      params.pageNo,
    );
  }
}
