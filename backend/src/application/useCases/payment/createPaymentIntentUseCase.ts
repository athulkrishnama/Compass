import { ICreatePaymentIntentUseCase } from "@application/interfaces/useCase/payment/createPaymentIntentUseCase.interface";
import {
  ICreateIndentRequestDTO,
  ICreateIndentResponseDTO,
} from "@domain/dtos/payment/createIndent.dto";
import { IPaymentService } from "@application/interfaces/service/paymentService.interface";
import { inject, injectable } from "tsyringe";
import { IRoomVariantRepo } from "@application/interfaces/repository/roomVariant/roomVariant.repo.interface";
import { IHotelBookingRepo } from "@application/interfaces/repository/hotelBooking/hotelBooking.repo.interface";
import { IRoomLockRepo } from "@application/interfaces/repository/roomLock/roomLock.repo.interface";
import { IRoomStatusRepo } from "@application/interfaces/repository/roomStatus/roomStatus.repo.interface";
import {
  InvalidOperationException,
  ResourceNotFoundException,
} from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";

import { IHotelPricingService } from "@application/interfaces/service/hotelPricingService";

@injectable()
export class CreatePaymentIntentUseCase implements ICreatePaymentIntentUseCase {
  constructor(
    @inject("IPaymentService") private _paymentService: IPaymentService,
    @inject("IRoomVariantRepo")
    private _roomVariantRepository: IRoomVariantRepo,
    @inject("IHotelBookingRepo")
    private _hotelBookingRepository: IHotelBookingRepo,
    @inject("IRoomLockRepo") private _roomLockRepository: IRoomLockRepo,
    @inject("IRoomStatusRepo") private _roomStatusRepository: IRoomStatusRepo,
    @inject("IHotelPricingService")
    private _pricingService: IHotelPricingService,
  ) {}

  async execute(
    data: ICreateIndentRequestDTO,
  ): Promise<ICreateIndentResponseDTO> {
    const numberOfRooms = data.numberOfRooms ?? 1;

    const roomVariant = await this._roomVariantRepository.findById(
      data.roomVariantId,
    );

    if (!roomVariant) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.ROOM_VARIANT_NOT_FOUND,
      );
    }

    const roomLockPromise = this._roomLockRepository.countRoomLock({
      roomVariantId: data.roomVariantId,
      beforeCheckInDate: data.checkOutDate,
      afterCheckOutDate: data.checkInDate,
    });

    const hotelBookingPromise = this._hotelBookingRepository.countBooking({
      roomVariantId: data.roomVariantId,
      beforeCheckInDate: data.checkOutDate,
      afterCheckOutDate: data.checkInDate,
    });

    const roomStatusPromise =
      this._roomStatusRepository.findByRoomVariantIdAndDateRange(
        data.roomVariantId,
        data.checkInDate,
        data.checkOutDate,
      );

    const [roomLockCount, hotelBookingCount, roomStatuses] = await Promise.all([
      roomLockPromise,
      hotelBookingPromise,
      roomStatusPromise,
    ]);

    const unavailableRoomCount = new Set(roomStatuses.map((s) => s.roomNumber))
      .size;

    const availableRoomCount =
      roomVariant.totalRooms -
      roomLockCount -
      hotelBookingCount -
      unavailableRoomCount;

    if (availableRoomCount < numberOfRooms) {
      throw new InvalidOperationException(
        INTERNAL_ERROR_MESSAGES.ROOM_UNAVAILABLE,
      );
    }

    const pricingDetails = await this._pricingService.calculateDynamicPrice({
      roomVariantId: data.roomVariantId,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
    });

    const totalAmount = pricingDetails.totalPrice * numberOfRooms;

    const { paymentIntentId, clientSecret } =
      await this._paymentService.createPaymentIntent(totalAmount, {
        roomVariantId: data.roomVariantId,
        checkInDate: data.checkInDate.toISOString(),
        checkOutDate: data.checkOutDate.toISOString(),
        guests: data.guests.toString(),
        numberOfRooms: numberOfRooms.toString(),
        traverlerId: data.traverlerId,
      });

    await this._roomLockRepository.create({
      roomVariantId: data.roomVariantId,
      travelerId: data.traverlerId,
      numberOfRooms,
      checkinDate: data.checkInDate,
      checkoutDate: data.checkOutDate,
      amount: totalAmount,
      paymentIntentId: paymentIntentId,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    return {
      paymentIntentId,
      clientSecret,
      amount: totalAmount,
    };
  }
}
