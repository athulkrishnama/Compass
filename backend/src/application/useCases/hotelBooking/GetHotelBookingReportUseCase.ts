import { inject, injectable } from "tsyringe";
import { IGetHotelBookingReportUseCase } from "@application/interfaces/useCase/hotelBooking/IGetHotelBookingReportUseCase";
import { IHotelBookingRepo } from "@application/interfaces/repository/hotelBooking/hotelBooking.repo.interface";
import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";
import {
  IHotelBookingReportResponseDTO,
  IHotelBookingReportRequestDTO,
} from "@domain/dtos/hotelBooking/hotelBookingReport.dto";
import { BOOKING_STATUS } from "@domain/enums/bookingStatus";
import { ResourceNotFoundException } from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";

import { VALUES } from "@presentation/constants/values";

@injectable()
export class GetHotelBookingReportUseCase
  implements IGetHotelBookingReportUseCase
{
  constructor(
    @inject("IHotelBookingRepo") private _hotelBookingRepo: IHotelBookingRepo,
    @inject("IHotelRepo") private _hotelRepo: IHotelRepo,
  ) {}

  async execute(
    params: IHotelBookingReportRequestDTO,
  ): Promise<IHotelBookingReportResponseDTO> {
    const hotel = await this._hotelRepo.findById(params.hotelId);
    if (!hotel || hotel.userId !== params.userId) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.HOTEL_NOT_FOUND,
      );
    }

    const { items, total } = await this._hotelBookingRepo.getHotelBookingReport(
      {
        hotelId: params.hotelId,
        status: params.status as BOOKING_STATUS | undefined,
        search: params.search,
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
        pageNo: params.pageNo,
      },
    );

    return {
      items,
      totalPages: Math.ceil(total / VALUES.REPORTS_LIMIT),
      currentPage: params.pageNo,
      totalCount: total,
    };
  }
}
