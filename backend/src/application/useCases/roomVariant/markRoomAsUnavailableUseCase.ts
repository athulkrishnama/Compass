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

    const existingRoomStatus =
      await this._roomStatusRepo.findByRoomVariantIdAndRoomNumber(
        data.roomVariantId,
        data.roomNumber,
      );

    if (existingRoomStatus) {
      throw new ConflictException(
        INTERNAL_ERROR_MESSAGES.ROOM_NUMBER_ALREADY_EXISTS,
      );
    }

    const activeBookings = await this._hotelBookingRepo.filterBooking({
      roomVariantId: data.roomVariantId,
      roomNumber: data.roomNumber.toString(),
      bookingStatus: BOOKING_STATUS.CHECKED_IN,
    });

    if (activeBookings.length > 0) {
      throw new ConflictException(
        INTERNAL_ERROR_MESSAGES.ROOM_HAS_ACTIVE_BOOKING,
      );
    }

    const id = await this._roomStatusRepo.create({
      roomVariantId: data.roomVariantId,
      roomNumber: data.roomNumber,
      status: data.status,
      reason: data.reason,
    });

    return id;
  }
}
