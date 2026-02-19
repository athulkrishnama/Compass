import { inject, injectable } from "tsyringe";
import { ICheckOutBookingUseCase } from "@application/interfaces/useCase/hotelBooking/ICheckOutBookingUseCase";
import { IHotelBookingRepo } from "@application/interfaces/repository/hotelBooking/hotelBooking.repo.interface";
import {
  InvalidOperationException,
  ResourceNotFoundException,
} from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { BOOKING_STATUS } from "@domain/enums/bookingStatus";

@injectable()
export class CheckOutBookingUseCase implements ICheckOutBookingUseCase {
  constructor(
    @inject("IHotelBookingRepo")
    private _hotelBookingRepo: IHotelBookingRepo,
  ) {}

  async execute(bookingId: string, hotelId: string): Promise<void> {
    const booking = await this._hotelBookingRepo.findById(bookingId);

    if (!booking) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.BOOKING_NOT_FOUND,
      );
    }

    if (booking.hotelId !== hotelId) {
      throw new InvalidOperationException(INTERNAL_ERROR_MESSAGES.NOT_ALLOWED);
    }

    if (booking.bookingStatus !== BOOKING_STATUS.CHECKED_IN) {
      throw new InvalidOperationException(
        INTERNAL_ERROR_MESSAGES.CHECKOUT_NOT_ALLOWED,
      );
    }

    await this._hotelBookingRepo.update(
      {
        ...booking,
        bookingStatus: BOOKING_STATUS.COMPLETED,
      },
      bookingId,
    );
  }
}
