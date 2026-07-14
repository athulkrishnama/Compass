import { inject, injectable } from "tsyringe";
import { IGetAdminHotelReportUseCase } from "@application/interfaces/useCase/admin/IGetAdminHotelReportUseCase";
import { IHotelBookingRepo } from "@application/interfaces/repository/hotelBooking/hotelBooking.repo.interface";
import { IAdminHotelReportResponseDTO } from "@domain/dtos/ride/driverRideReport.dto";
import { IAdminHotelReportRequestDTO } from "@domain/dtos/hotelBooking/hotelBookingReport.dto";
import { BOOKING_STATUS } from "@domain/enums/bookingStatus";
import { HotelBookingMapper } from "@application/mappers/hotelBookingMapper";

import { VALUES } from "@presentation/constants/values";

@injectable()
export class GetAdminHotelReportUseCase implements IGetAdminHotelReportUseCase {
  constructor(
    @inject("IHotelBookingRepo") private _hotelBookingRepo: IHotelBookingRepo,
  ) {}

  async execute(
    params: IAdminHotelReportRequestDTO,
  ): Promise<IAdminHotelReportResponseDTO> {
    const { items, total } = await this._hotelBookingRepo.getAdminHotelReport({
      status: params.status as BOOKING_STATUS | undefined,
      search: params.search,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      pageNo: params.pageNo,
    });

    return HotelBookingMapper.toAdminHotelReportResponseDTO(
      items,
      total,
      VALUES.REPORTS_LIMIT,
      params.pageNo,
    );
  }
}
