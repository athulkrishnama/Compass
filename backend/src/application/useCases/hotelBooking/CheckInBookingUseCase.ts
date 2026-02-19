import { inject, injectable } from "tsyringe";
import { ICheckInBookingUseCase } from "@application/interfaces/useCase/hotelBooking/ICheckInBookingUseCase";
import { IHotelBookingRepo } from "@application/interfaces/repository/hotelBooking/hotelBooking.repo.interface";
import { IRoomVariantRepo } from "@application/interfaces/repository/roomVariant/roomVariant.repo.interface";
import { IRoomStatusRepo } from "@application/interfaces/repository/roomStatus/roomStatus.repo.interface";
import {
  InvalidOperationException,
  ResourceNotFoundException,
} from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { BOOKING_STATUS } from "@domain/enums/bookingStatus";

@injectable()
export class CheckInBookingUseCase implements ICheckInBookingUseCase {
  constructor(
    @inject("IHotelBookingRepo")
    private _hotelBookingRepo: IHotelBookingRepo,
    @inject("IRoomVariantRepo")
    private _roomVariantRepo: IRoomVariantRepo,
    @inject("IRoomStatusRepo")
    private _roomStatusRepo: IRoomStatusRepo,
  ) {}

  async execute(
    bookingId: string,
    hotelId: string,
    roomNumber?: number,
  ): Promise<void> {
    const booking = await this._hotelBookingRepo.findById(bookingId);

    if (!booking) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.BOOKING_NOT_FOUND,
      );
    }

    if (booking.hotelId !== hotelId) {
      throw new InvalidOperationException(INTERNAL_ERROR_MESSAGES.NOT_ALLOWED);
    }

    if (booking.bookingStatus !== BOOKING_STATUS.CONFIRMED) {
      throw new InvalidOperationException(
        INTERNAL_ERROR_MESSAGES.CHECKIN_NOT_ALLOWED,
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkinDate = new Date(booking.checkinDate);
    checkinDate.setHours(0, 0, 0, 0);

    const checkoutDate = new Date(booking.checkoutDate);
    checkoutDate.setHours(0, 0, 0, 0);

    if (today < checkinDate) {
      throw new InvalidOperationException(
        INTERNAL_ERROR_MESSAGES.CHECKIN_DATE_NOT_REACHED,
      );
    }

    if (today > checkoutDate) {
      throw new InvalidOperationException(
        INTERNAL_ERROR_MESSAGES.CHECKIN_NOT_ALLOWED,
      );
    }

    if (roomNumber !== undefined) {
      const roomVariant = await this._roomVariantRepo.findById(
        booking.roomVariantId,
      );

      if (
        !roomVariant ||
        roomNumber > roomVariant.totalRooms ||
        roomNumber < 1
      ) {
        throw new InvalidOperationException(
          INTERNAL_ERROR_MESSAGES.ROOM_NOT_AVAILABLE_FOR_CHECKIN,
        );
      }

      const roomStatus =
        await this._roomStatusRepo.findByRoomVariantIdAndRoomNumber(
          booking.roomVariantId,
          roomNumber,
        );

      if (roomStatus) {
        throw new InvalidOperationException(
          INTERNAL_ERROR_MESSAGES.ROOM_NOT_AVAILABLE_FOR_CHECKIN,
        );
      }

      const checkedInBookings = await this._hotelBookingRepo.filterBooking({
        roomVariantId: booking.roomVariantId,
        bookingStatus: BOOKING_STATUS.CHECKED_IN,
      });

      const isOccupied = checkedInBookings.some(
        (b) => Number(b.roomNumber) === roomNumber,
      );

      if (isOccupied) {
        throw new InvalidOperationException(
          INTERNAL_ERROR_MESSAGES.ROOM_NOT_AVAILABLE_FOR_CHECKIN,
        );
      }

      await this._hotelBookingRepo.update(
        {
          ...booking,
          bookingStatus: BOOKING_STATUS.CHECKED_IN,
          roomNumber: String(roomNumber),
        },
        bookingId,
      );
    } else {
      await this._hotelBookingRepo.update(
        {
          ...booking,
          bookingStatus: BOOKING_STATUS.CHECKED_IN,
          isWalkIn: true,
        },
        bookingId,
      );
    }
  }
}
