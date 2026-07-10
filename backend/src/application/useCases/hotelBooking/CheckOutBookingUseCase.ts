import { inject, injectable } from "tsyringe";
import { ICheckOutBookingUseCase } from "@application/interfaces/useCase/hotelBooking/ICheckOutBookingUseCase";
import { IHotelBookingRepo } from "@application/interfaces/repository/hotelBooking/hotelBooking.repo.interface";
import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";
import {
  InvalidOperationException,
  ResourceNotFoundException,
} from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { BOOKING_STATUS } from "@domain/enums/bookingStatus";
import { INotificationService } from "@application/interfaces/service/notificationService.interface";
import { NOTIFICATION_TYPES } from "@domain/types/notificationType";

@injectable()
export class CheckOutBookingUseCase implements ICheckOutBookingUseCase {
  constructor(
    @inject("IHotelBookingRepo")
    private _hotelBookingRepo: IHotelBookingRepo,
    @inject("IHotelRepo")
    private _hotelRepo: IHotelRepo,
    @inject("INotificationService")
    private _notificationService: INotificationService,
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

    const hotel = await this._hotelRepo.findById(hotelId);
    if (!hotel) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.HOTEL_NOT_FOUND,
      );
    }

    try {
      await this._notificationService.notify(
        booking.travelerId,
        NOTIFICATION_TYPES.BOOKING_CHECKED_OUT,
        "Check-Out Complete ",
        `Thank you for staying at ${hotel.name}! We hope you had a wonderful experience. See you again soon!`,
        { bookingId, hotelId, hotelName: hotel.name },
      );
    } catch (notifyErr) {
      console.error(
        "[CheckOutBookingUseCase] Failed to send check-out notification:",
        notifyErr,
      );
    }
  }
}
