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
import { INotificationService } from "@application/interfaces/service/notificationService.interface";
import { NOTIFICATION_TYPES } from "@domain/types/notificationType";

@injectable()
export class CheckInBookingUseCase implements ICheckInBookingUseCase {
  constructor(
    @inject("IHotelBookingRepo")
    private _hotelBookingRepo: IHotelBookingRepo,
    @inject("IRoomVariantRepo")
    private _roomVariantRepo: IRoomVariantRepo,
    @inject("IRoomStatusRepo")
    private _roomStatusRepo: IRoomStatusRepo,
    @inject("INotificationService")
    private _notificationService: INotificationService,
  ) {}

  async execute(
    bookingId: string,
    hotelId: string,
    roomNumbers?: number[],
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

    if (roomNumbers !== undefined && roomNumbers.length > 0) {
      const expectedCount = booking.numberOfRooms ?? 1;

      if (roomNumbers.length !== expectedCount) {
        throw new InvalidOperationException(
          INTERNAL_ERROR_MESSAGES.ROOM_NOT_AVAILABLE_FOR_CHECKIN,
        );
      }

      const roomVariant = await this._roomVariantRepo.findById(
        booking.roomVariantId,
      );

      if (!roomVariant) {
        throw new InvalidOperationException(
          INTERNAL_ERROR_MESSAGES.ROOM_NOT_AVAILABLE_FOR_CHECKIN,
        );
      }

      for (const roomNum of roomNumbers) {
        if (roomNum > roomVariant.totalRooms || roomNum < 1) {
          throw new InvalidOperationException(
            INTERNAL_ERROR_MESSAGES.ROOM_NOT_AVAILABLE_FOR_CHECKIN,
          );
        }
      }

      if (new Set(roomNumbers).size !== roomNumbers.length) {
        throw new InvalidOperationException(
          INTERNAL_ERROR_MESSAGES.ROOM_NOT_AVAILABLE_FOR_CHECKIN,
        );
      }

      const roomStatuses =
        await this._roomStatusRepo.findByRoomVariantIdAndDateRange(
          booking.roomVariantId,
          booking.checkinDate,
          booking.checkoutDate,
        );
      const statusRoomNumbers = new Set(roomStatuses.map((s) => s.roomNumber));

      for (const roomNum of roomNumbers) {
        if (statusRoomNumbers.has(roomNum)) {
          throw new InvalidOperationException(
            INTERNAL_ERROR_MESSAGES.ROOM_NOT_AVAILABLE_FOR_CHECKIN,
          );
        }
      }

      const checkedInBookings = await this._hotelBookingRepo.filterBooking({
        roomVariantId: booking.roomVariantId,
        bookingStatus: BOOKING_STATUS.CHECKED_IN,
      });

      const occupiedRoomNumbers = new Set<number>();
      for (const b of checkedInBookings) {
        if (b.roomNumbers) {
          b.roomNumbers.forEach((rn) => occupiedRoomNumbers.add(rn));
        }
      }

      for (const roomNum of roomNumbers) {
        if (occupiedRoomNumbers.has(roomNum)) {
          throw new InvalidOperationException(
            INTERNAL_ERROR_MESSAGES.ROOM_NOT_AVAILABLE_FOR_CHECKIN,
          );
        }
      }

      await this._hotelBookingRepo.update(
        {
          ...booking,
          bookingStatus: BOOKING_STATUS.CHECKED_IN,
          roomNumbers,
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

    try {
      if (roomNumbers !== undefined && roomNumbers.length > 0) {
        await this._notificationService.notify(
          booking.travelerId,
          NOTIFICATION_TYPES.BOOKING_CHECKED_IN,
          "Check-In Successful",
          `You have successfully checked in. Enjoy your stay! Room number(s): ${roomNumbers.join(", ")}.`,
          { bookingId, roomNumbers, hotelId: booking.hotelId },
        );
      } else {
        await this._notificationService.notify(
          booking.travelerId,
          NOTIFICATION_TYPES.BOOKING_CHECKED_IN,
          "Walk-In Check-In Successful",
          "You have successfully checked in as a walk-in guest. The receptionist will give you details about your stay. Enjoy your stay!",
          { bookingId, roomNumbers: null, hotelId: booking.hotelId },
        );
      }
    } catch (notifyErr) {
      console.error(
        "[CheckInBookingUseCase] Failed to send check-in notification:",
        notifyErr,
      );
    }
  }
}
