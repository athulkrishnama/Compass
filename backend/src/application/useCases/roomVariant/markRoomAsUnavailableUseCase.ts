import {
  ConflictException,
  InvalideDataException,
} from "@application/constants/Exceptions";
import { IHotelBookingRepo } from "@application/interfaces/repository/hotelBooking/hotelBooking.repo.interface";
import { IRoomStatusRepo } from "@application/interfaces/repository/roomStatus/roomStatus.repo.interface";
import { IRoomVariantRepo } from "@application/interfaces/repository/roomVariant/roomVariant.repo.interface";
import { IMarkRoomAsUnavailableUseCase } from "@application/interfaces/useCase/roomVariant/markRoomAsUnavailableUseCase.interface";
import { IMarkRoomAsUnavailableRequestDTO } from "@domain/dtos/roomVariant/markRoomAsUnavailable.dto";
import { BOOKING_STATUS } from "@domain/enums/bookingStatus";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { inject, injectable } from "tsyringe";

@injectable()
export class MarkRoomAsUnavailableUseCase
  implements IMarkRoomAsUnavailableUseCase
{
  constructor(
    @inject("IRoomStatusRepo")
    private _roomStatusRepo: IRoomStatusRepo,
    @inject("IRoomVariantRepo")
    private _roomVariantRepo: IRoomVariantRepo,
    @inject("IHotelBookingRepo")
    private _hotelBookingRepo: IHotelBookingRepo,
  ) {}

  async execute(data: IMarkRoomAsUnavailableRequestDTO): Promise<string> {
    const roomVariant = await this._roomVariantRepo.findById(
      data.roomVariantId,
    );

    if (!roomVariant) {
      throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.INVALID_ID);
    }

    if (data.roomNumber > roomVariant.totalRooms) {
      throw new InvalideDataException(
        INTERNAL_ERROR_MESSAGES.INVALID_ROOM_NUMBER,
      );
    }

    if (data.startDate >= data.endDate) {
      throw new InvalideDataException(
        INTERNAL_ERROR_MESSAGES.INVALID_DATE_RANGE,
      );
    }

    const overlappingStatuses =
      await this._roomStatusRepo.findByRoomVariantIdAndDateRange(
        data.roomVariantId,
        data.startDate,
        data.endDate,
      );
    const conflictingStatus = overlappingStatuses.find(
      (s) => s.roomNumber === data.roomNumber,
    );
    if (conflictingStatus) {
      throw new ConflictException(
        INTERNAL_ERROR_MESSAGES.ROOM_NUMBER_ALREADY_EXISTS,
      );
    }

    const checkedInBookings = await this._hotelBookingRepo.filterBooking({
      roomVariantId: data.roomVariantId,
      bookingStatus: BOOKING_STATUS.CHECKED_IN,
    });

    const hasActiveBooking = checkedInBookings.some((b) => {
      const roomMatches = b.roomNumbers?.includes(data.roomNumber);
      if (!roomMatches) return false;
      return (
        new Date(b.checkinDate) < data.endDate &&
        new Date(b.checkoutDate) > data.startDate
      );
    });

    if (hasActiveBooking) {
      throw new ConflictException(
        INTERNAL_ERROR_MESSAGES.ROOM_HAS_ACTIVE_BOOKING,
      );
    }

    const id = await this._roomStatusRepo.create({
      roomVariantId: data.roomVariantId,
      roomNumber: data.roomNumber,
      status: data.status,
      reason: data.reason,
      startDate: data.startDate,
      endDate: data.endDate,
    });

    return id;
  }
}
