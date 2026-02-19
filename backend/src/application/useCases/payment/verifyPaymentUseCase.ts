import { InvalidOperationException } from "@application/constants/Exceptions";
import { IHotelBookingRepo } from "@application/interfaces/repository/hotelBooking/hotelBooking.repo.interface";
import { IRoomLockRepo } from "@application/interfaces/repository/roomLock/roomLock.repo.interface";
import { IRoomVariantRepo } from "@application/interfaces/repository/roomVariant/roomVariant.repo.interface";
import { IPaymentService } from "@application/interfaces/service/paymentService.interface";
import { IVerifyPaymentUseCase } from "@application/interfaces/useCase/payment/verifyPaymentUseCase.interface";
import { HotelBookingEntity } from "@domain/entities/hotelBooking/hotelBooking.entity";
import { BOOKING_STATUS } from "@domain/enums/bookingStatus";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { Messages } from "@domain/enums/messages";
import { PAYMENT_STATUS } from "@domain/enums/paymentStatus";
import { inject, injectable } from "tsyringe";

import { ITransactionRepo } from "@application/interfaces/repository/transaction/transaction.repo.interface";
import { TRANSACTION_TYPE } from "@domain/enums/transactionType";
import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";
import { SERVICE_TYPE } from "@domain/enums/serviceType";

@injectable()
export class VerifyPaymentUseCase implements IVerifyPaymentUseCase {
  constructor(
    @inject("IPaymentService")
    private _paymentService: IPaymentService,
    @inject("IRoomLockRepo")
    private _roomLockRepo: IRoomLockRepo,
    @inject("IHotelBookingRepo")
    private _hotelBookingRepo: IHotelBookingRepo,
    @inject("IRoomVariantRepo")
    private _roomVariantRepository: IRoomVariantRepo,
    @inject("ITransactionRepo")
    private _transactionRepo: ITransactionRepo,
    @inject("IHotelRepo")
    private _hotelRepo: IHotelRepo,
  ) {}

  async execute(data: {
    signature: string;
    body: string | Buffer<ArrayBufferLike>;
  }): Promise<string> {
    const { status, metadata, paymentIntentId } =
      await this._paymentService.confirmPayment(data.signature, data.body);

    const { traverlerId, guests } = metadata || {};

    if (!status || !paymentIntentId || !traverlerId || !guests) {
      throw new InvalidOperationException(INTERNAL_ERROR_MESSAGES.INVALID_DATA);
    }

    const [lock] = await this._roomLockRepo.filterRoomLock({
      paymentIntentId: paymentIntentId,
    });

    if (!lock) {
      throw new InvalidOperationException(
        INTERNAL_ERROR_MESSAGES.ROOM_LOCK_NOT_FOUND,
      );
    }

    const roomVaraint = await this._roomVariantRepository.findById(
      lock.roomVariantId,
    );

    if (!roomVaraint) {
      throw new InvalidOperationException(
        INTERNAL_ERROR_MESSAGES.ROOM_VARIANT_NOT_FOUND,
      );
    }

    const hotel = await this._hotelRepo.findById(roomVaraint.hotelId);
    if (!hotel) {
      throw new InvalidOperationException(
        INTERNAL_ERROR_MESSAGES.HOTEL_NOT_FOUND,
      );
    }

    const booking: HotelBookingEntity = {
      hotelId: roomVaraint.hotelId,
      bookingStatus: BOOKING_STATUS.CONFIRMED,
      checkinDate: lock.checkinDate,
      checkoutDate: lock.checkoutDate,
      paymentIntendId: paymentIntentId,
      travelerId: traverlerId,
      roomVariantId: lock.roomVariantId,
      totalAmount: lock.amount,
      paymentStatus: PAYMENT_STATUS.SUCCESS,
      isWalkIn: false,
    };

    const newBooking = await this._hotelBookingRepo.create(booking);

    await this._transactionRepo.create({
      bookingId: newBooking._id!.toString(),
      userId: hotel.userId.toString(),
      serviceType: SERVICE_TYPE.HOTEL,
      providerId: hotel.userId.toString(),
      amount: lock.amount,
      type: TRANSACTION_TYPE.PAYMENT,
    });

    await this._roomLockRepo.deleteById(lock._id!);

    return Messages.PAYMENT_VERIFIED_SUCCESSFULLY;
  }
}
