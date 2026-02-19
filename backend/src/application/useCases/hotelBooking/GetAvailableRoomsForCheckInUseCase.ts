import { inject, injectable } from "tsyringe";
import { IGetAvailableRoomsForCheckInUseCase } from "@application/interfaces/useCase/hotelBooking/IGetAvailableRoomsForCheckInUseCase";
import { IHotelBookingRepo } from "@application/interfaces/repository/hotelBooking/hotelBooking.repo.interface";
import { IRoomVariantRepo } from "@application/interfaces/repository/roomVariant/roomVariant.repo.interface";
import { IRoomStatusRepo } from "@application/interfaces/repository/roomStatus/roomStatus.repo.interface";
import { IAvailableRoomsResponseDTO } from "@domain/dtos/hotelBooking/checkIn.dto";
import {
  InvalidOperationException,
  ResourceNotFoundException,
} from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { BOOKING_STATUS } from "@domain/enums/bookingStatus";

@injectable()
export class GetAvailableRoomsForCheckInUseCase
  implements IGetAvailableRoomsForCheckInUseCase
{
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
  ): Promise<IAvailableRoomsResponseDTO> {
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

    const roomVariant = await this._roomVariantRepo.findById(
      booking.roomVariantId,
    );

    if (!roomVariant) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.ROOM_VARIANT_NOT_FOUND,
      );
    }

    const checkedInBookings = await this._hotelBookingRepo.filterBooking({
      roomVariantId: booking.roomVariantId,
      bookingStatus: BOOKING_STATUS.CHECKED_IN,
    });

    const occupiedRoomNumbers = new Set(
      checkedInBookings
        .filter((b) => b.roomNumber)
        .map((b) => Number(b.roomNumber)),
    );

    const roomStatuses = await this._roomStatusRepo.findByRoomVariantId(
      booking.roomVariantId,
    );

    const unavailableRooms: { roomNumber: number; reason: string }[] = [];
    const unavailableRoomNumbers = new Set<number>();

    for (const status of roomStatuses) {
      unavailableRooms.push({
        roomNumber: status.roomNumber,
        reason: status.status,
      });
      unavailableRoomNumbers.add(status.roomNumber);
    }

    for (const roomNum of occupiedRoomNumbers) {
      if (!unavailableRoomNumbers.has(roomNum)) {
        unavailableRooms.push({
          roomNumber: roomNum,
          reason: "OCCUPIED",
        });
        unavailableRoomNumbers.add(roomNum);
      }
    }

    const availableRooms: number[] = [];
    for (let i = 1; i <= roomVariant.totalRooms; i++) {
      if (!unavailableRoomNumbers.has(i)) {
        availableRooms.push(i);
      }
    }

    return { availableRooms, unavailableRooms };
  }
}
