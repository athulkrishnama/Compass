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
import { getNumberOfDays } from "@presentation/utils/date";

@injectable()
export class CreatePaymentIntentUseCase implements ICreatePaymentIntentUseCase {
  constructor(
    @inject("IPaymentService") private _paymentService: PaymentService,
    @inject("IRoomVariantRepo")
    private _roomVariantRepository: IRoomVariantRepo,
    @inject("IHotelBookingRepo")
    private _hotelBookingRepository: IHotelBookingRepo,
    @inject("IRoomLockRepo") private _roomLockRepository: IRoomLockRepo,
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

    const availableRoomCount = 0;

    if (availableRoomCount <= 0) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.ROOM_UNAVAILABLE,
      );
    }

    const totalAmount =
      getNumberOfDays(data.checkInDate, data.checkOutDate) *
      roomVariant.basePrice;

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
