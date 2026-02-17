import { IHotelBookingRepo } from "@application/interfaces/repository/hotelBooking/hotelBooking.repo.interface";
import { IBookingStatusResponseDTO } from "@domain/dtos/hotelBooking/bookingStatusResponse.dto";
import { BookingStatusResponseStatus } from "@domain/enums/bookingStatusResponseStatus";
import { BookingStatusMapper } from "@mappers/bookingStatusMapper";
import { IGetBookingByPaymentIdUseCase } from "@application/interfaces/useCase/hotelBooking/IGetBookingByPaymentIdUseCase";
import { inject, injectable } from "tsyringe";
import { IRoomLockRepo } from "@application/interfaces/repository/roomLock/roomLock.repo.interface";

@injectable()
export class GetBookingByPaymentIdUseCase
  implements IGetBookingByPaymentIdUseCase
{
  constructor(
    @inject("IHotelBookingRepo") private _hotelBookingRepo: IHotelBookingRepo,
    @inject("IRoomLockRepo") private _roomLockRepo: IRoomLockRepo,
  ) {}
  async execute(paymentId: string): Promise<IBookingStatusResponseDTO> {
    const booking = await this._hotelBookingRepo.filterBooking({
      paymentIntendId: paymentId,
    });

    if (booking && booking.length > 0) {
      return BookingStatusMapper.toGetBookingStatusResponseDTOFromEntity(
        BookingStatusResponseStatus.SUCCESS,
      );
    }

    const roomLock = await this._roomLockRepo.filterRoomLock({
      paymentIntentId: paymentId,
    });

    if (roomLock.length > 0) {
      return BookingStatusMapper.toGetBookingStatusResponseDTOFromEntity(
        BookingStatusResponseStatus.PENDING,
      );
    }

    return BookingStatusMapper.toGetBookingStatusResponseDTOFromEntity(
      BookingStatusResponseStatus.TIMEOUT,
    );
  }
}
