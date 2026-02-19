import { ICreatePaymentIntentUseCase } from "@application/interfaces/useCase/payment/createPaymentIntentUseCase.interface";
import {
  ICreateIndentRequestDTO,
  ICreateIndentResponseDTO,
} from "@domain/dtos/payment/createIndent.dto";
import { PaymentService } from "@infrastructure/services/paymentService";
import { inject, injectable } from "tsyringe";
import { IRoomVariantRepo } from "@application/interfaces/repository/roomVariant/roomVariant.repo.interface";
import { IHotelBookingRepo } from "@application/interfaces/repository/hotelBooking/hotelBooking.repo.interface";
import { IRoomLockRepo } from "@application/interfaces/repository/roomLock/roomLock.repo.interface";
import { ResourceNotFoundException } from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";

import { IPricingService } from "@application/interfaces/services/IPricingService";

@injectable()
export class CreatePaymentIntentUseCase implements ICreatePaymentIntentUseCase {
  constructor(
    @inject("IPaymentService") private _paymentService: PaymentService,
    @inject("IRoomVariantRepo")
    private _roomVariantRepository: IRoomVariantRepo,
    @inject("IHotelBookingRepo")
    private _hotelBookingRepository: IHotelBookingRepo,
    @inject("IRoomLockRepo") private _roomLockRepository: IRoomLockRepo,
    @inject("IPricingService") private _pricingService: IPricingService,
  ) {}
  async execute(
    data: ICreateIndentRequestDTO,
  ): Promise<ICreateIndentResponseDTO> {
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

    const [roomLockCount, hotelBookingCount] = await Promise.all([
      roomLockPromise,
      hotelBookingPromise,
    ]);

    const availableRoomCount =
      roomVariant.totalRooms - roomLockCount - hotelBookingCount;

    if (availableRoomCount <= 0) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.ROOM_UNAVAILABLE,
      );
    }

    const pricingDetails = await this._pricingService.calculateDynamicPrice({
      roomVariantId: data.roomVariantId,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
    });

    const totalAmount = pricingDetails.totalPrice;

    const { paymentIntentId, clientSecret } =
      await this._paymentService.createPaymentIntent(totalAmount, {
        roomVariantId: data.roomVariantId,
        checkInDate: data.checkInDate.toISOString(),
        checkOutDate: data.checkOutDate.toISOString(),
        guests: data.guests.toString(),
        traverlerId: data.traverlerId,
      });

    await this._roomLockRepository.create({
      roomVariantId: data.roomVariantId,
      travelerId: data.traverlerId,
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
