import { ResourceNotFoundException } from "@application/constants/Exceptions";
import { IHotelBookingRepo } from "@application/interfaces/repository/hotelBooking/hotelBooking.repo.interface";
import { IRoomLockRepo } from "@application/interfaces/repository/roomLock/roomLock.repo.interface";
import { IRoomVariantRepo } from "@application/interfaces/repository/roomVariant/roomVariant.repo.interface";
import { IRoomStatusRepo } from "@application/interfaces/repository/roomStatus/roomStatus.repo.interface";
import { IGetRoomAvailabilityUseCase } from "@application/interfaces/useCase/roomVariant/getRoomAvailabilityUseCase.interface";
import { IHotelPricingService } from "@application/interfaces/service/hotelPricingService";
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
    @inject("IRoomStatusRepo")
    private readonly _roomStatusRepository: IRoomStatusRepo,
    @inject("IHotelPricingService")
    private readonly _pricingService: IHotelPricingService,
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

    const roomStatusPromise =
      this._roomStatusRepository.findByRoomVariantIdAndDateRange(
        data.roomVariantId,
        data.checkinDate,
        data.checkoutDate,
      );

    const pricingPromise = this._pricingService.calculateDynamicPrice({
      roomVariantId: data.roomVariantId,
      checkInDate: data.checkinDate,
      checkOutDate: data.checkoutDate,
    });

    const [roomLockCount, hotelBookingCount, roomStatuses, pricingDetails] =
      await Promise.all([
        roomLockPromise,
        hotelBookingPromise,
        roomStatusPromise,
        pricingPromise,
      ]);

    const unavailableRoomCount = new Set(roomStatuses.map((s) => s.roomNumber))
      .size;

    const availableRoomCount =
      roomVariant.totalRooms -
      roomLockCount -
      hotelBookingCount -
      unavailableRoomCount;

    return {
      available: Math.max(availableRoomCount, 0),
      dynamicPrice: pricingDetails.totalPrice,
    };
  }
}
