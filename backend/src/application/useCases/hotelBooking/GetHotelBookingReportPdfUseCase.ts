import { inject, injectable } from "tsyringe";
import { IHotelBookingReportPdfRequestDTO } from "@domain/dtos/hotelBooking/hotelBookingReport.dto";
import { IGetHotelBookingReportPdfUseCase } from "@application/interfaces/useCase/hotelBooking/IGetHotelBookingReportPdfUseCase";
import { IHotelBookingRepo } from "@application/interfaces/repository/hotelBooking/hotelBooking.repo.interface";
import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";
import { BOOKING_STATUS } from "@domain/enums/bookingStatus";
import { ResourceNotFoundException } from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { IPdfGeneratorService } from "@application/interfaces/service/pdfGenerator.service.interface";

@injectable()
export class GetHotelBookingReportPdfUseCase
  implements IGetHotelBookingReportPdfUseCase
{
  constructor(
    @inject("IHotelBookingRepo") private _hotelBookingRepo: IHotelBookingRepo,
    @inject("IHotelRepo") private _hotelRepo: IHotelRepo,
    @inject("IPdfGeneratorService")
    private _pdfGeneratorService: IPdfGeneratorService,
  ) {}

  async execute(params: IHotelBookingReportPdfRequestDTO): Promise<Buffer> {
    const hotel = await this._hotelRepo.findById(params.hotelId);
    if (!hotel || hotel.userId !== params.userId) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.HOTEL_NOT_FOUND,
      );
    }

    const items = await this._hotelBookingRepo.getAllHotelBookingsForReport({
      hotelId: params.hotelId,
      status: params.status as BOOKING_STATUS | undefined,
      search: params.search,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
    });

    return this._pdfGeneratorService.generateHotelReportPdfBuffer(
      items,
      `${hotel.name} — Booking Report`,
    );
  }
}
