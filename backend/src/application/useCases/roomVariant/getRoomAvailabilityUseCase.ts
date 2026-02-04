import { ResourceNotFoundException } from "@application/constants/Exceptions";
import { IHotelBookingRepo } from "@application/interfaces/repository/hotelBooking/hotelBooking.repo.interface";
import { IRoomRepo } from "@application/interfaces/repository/room/room.repo.interface";
import { IRoomLockRepo } from "@application/interfaces/repository/roomLock/roomLock.repo.interface";
import { IRoomVariantRepo } from "@application/interfaces/repository/roomVariant/roomVariant.repo.interface";
import { IGetRoomAvailabilityUseCase } from "@application/interfaces/useCase/roomVariant/getRoomAvailabilityUseCase.interface";
import {
  IGetRoomAvailabilityRequestDTO,
  IGetRoomAvailabilityResponseDTO,
} from "@domain/dtos/roomVariant/getRoomAvailability.dto";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetRoomAvailabilityUseCase implements IGetRoomAvailabilityUseCase {
  constructor(
    @inject("IRoomVariantRepo")
    private readonly _roomVariantRepository: IRoomVariantRepo,
    @inject("IRoomLockRepo")
    private readonly _roomLockRepository: IRoomLockRepo,
    @inject("IHotelBookingRepo")
    private readonly _hotelBookingRepository: IHotelBookingRepo,
    @inject("IRoomRepo")
    private readonly _roomRepository: IRoomRepo,
  ) {}

  async execute(
    data: IGetRoomAvailabilityRequestDTO,
  ): Promise<IGetRoomAvailabilityResponseDTO> {
    const { checkinDate, checkoutDate, roomVariantId } = data;

    const roomVariant =
      await this._roomVariantRepository.findById(roomVariantId);

    if (!roomVariant) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.ROOM_VARIANT_NOT_FOUND,
      );
    }

    const totalRoomCount =
      await this._roomRepository.countRoomByVariantId(roomVariantId);

    const totalBookedRoomCount =
      await this._hotelBookingRepository.countBooking({
        roomVariantId,
        beforeCheckInDate: checkoutDate,
        afterCheckOutDate: checkinDate,
      });
    const totalLockedRoomCount = await this._roomLockRepository.countRoomLock({
      roomVariantId,
      beforeCheckInDate: checkoutDate,
      afterCheckOutDate: checkinDate,
    });

    const availableRoomCount =
      totalRoomCount - (totalBookedRoomCount + totalLockedRoomCount);

    return {
      available: availableRoomCount,
    };
  }
}
