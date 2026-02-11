import { ResourceNotFoundException } from "@application/constants/Exceptions";
import { IHotelBookingRepo } from "@application/interfaces/repository/hotelBooking/hotelBooking.repo.interface";
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
  ) {}

  async execute(
    data: IGetRoomAvailabilityRequestDTO,
  ): Promise<IGetRoomAvailabilityResponseDTO> {
    const { roomVariantId } = data;

    const roomVariant =
      await this._roomVariantRepository.findById(roomVariantId);

    if (!roomVariant) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.ROOM_VARIANT_NOT_FOUND,
      );
    }

    const roomLockPromise = this._roomLockRepository.countRoomLock({
      roomVariantId: data.roomVariantId,
      beforeCheckInDate: data.checkoutDate,
      afterCheckOutDate: data.checkinDate,
    });

    const hotelBookingPromise = this._hotelBookingRepository.countBooking({
      roomVariantId: data.roomVariantId,
      beforeCheckInDate: data.checkoutDate,
      afterCheckOutDate: data.checkinDate,
    });

    const [roomLockCount, hotelBookingCount] = await Promise.all([
      roomLockPromise,
      hotelBookingPromise,
    ]);

    const availableRoomCount =
      roomVariant.totalRooms - roomLockCount - hotelBookingCount;

    return {
      available: availableRoomCount,
    };
  }
}
