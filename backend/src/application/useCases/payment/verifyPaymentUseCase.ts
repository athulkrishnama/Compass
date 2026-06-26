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
import { SERVICE_TYPE } from "@domain/enums/serviceType";
import { inject, injectable } from "tsyringe";

import { ITransactionRepo } from "@application/interfaces/repository/transaction/transaction.repo.interface";
import { TRANSACTION_TYPE } from "@domain/enums/transactionType";
import { PAYMENT_METHOD } from "@domain/enums/paymentMethod";
import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";
import { IVerifyStripeCabPaymentUseCase } from "@application/interfaces/useCase/cabPayment/IVerifyStripeCabPaymentUseCase";
import { IWalletRepo } from "@application/interfaces/repository/wallet/wallet.repo.interface";
import { IUserRepo } from "@application/interfaces/repository/users/user.repo.interface";
import { ROLES } from "@domain/enums/roles";
import { env } from "@config/envConfig";

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
    @inject("IVerifyStripeCabPaymentUseCase")
    private _verifyCabPayment: IVerifyStripeCabPaymentUseCase,
    @inject("IWalletRepo")
    private _walletRepo: IWalletRepo,
    @inject("IUserRepo")
    private _userRepo: IUserRepo,
  ) {}

  async execute(data: {
    signature: string;
    body: string | Buffer<ArrayBufferLike>;
  }): Promise<string> {
    const { status, metadata, paymentIntentId } =
      await this._paymentService.confirmPayment(data.signature, data.body);

    if (!status || !paymentIntentId || !metadata) {
      throw new InvalidOperationException(INTERNAL_ERROR_MESSAGES.INVALID_DATA);
    }

    if (metadata.serviceType === "WALLET_TOP_UP") {
      const { userId, amount } = metadata;
      if (!userId || !amount) {
        throw new InvalidOperationException(
          INTERNAL_ERROR_MESSAGES.INVALID_DATA,
        );
      }

      const parsedAmount = parseFloat(amount);

      await this._walletRepo.creditWallet(
        userId,
        SERVICE_TYPE.USER,
        parsedAmount,
      );

      await this._transactionRepo.create({
        bookingId: paymentIntentId,
        ownerType: SERVICE_TYPE.USER,
        ownerId: userId,
        amount: parsedAmount,
        type: TRANSACTION_TYPE.TOP_UP,
        paymentMethod: PAYMENT_METHOD.STRIPE,
        description: "Wallet Top-up via Stripe",
      });

      return "Wallet Top-Up Successful";
    }

    if (metadata.serviceType === SERVICE_TYPE.CAB) {
      const { tripId, riderId } = metadata;
      if (!tripId || !riderId) {
        throw new InvalidOperationException(
          INTERNAL_ERROR_MESSAGES.INVALID_DATA,
        );
      }
      await this._verifyCabPayment.execute(tripId, riderId);
      return Messages.CAB_PAYMENT_VERIFIED;
    }

    const { traverlerId, guests } = metadata || {};

    if (!traverlerId || !guests) {
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

    const roomVariant = await this._roomVariantRepository.findById(
      lock.roomVariantId,
    );

    if (!roomVariant) {
      throw new InvalidOperationException(
        INTERNAL_ERROR_MESSAGES.ROOM_VARIANT_NOT_FOUND,
      );
    }

    const hotel = await this._hotelRepo.findById(roomVariant.hotelId);
    if (!hotel) {
      throw new InvalidOperationException(
        INTERNAL_ERROR_MESSAGES.HOTEL_NOT_FOUND,
      );
    }

    const adminUser = await this._userRepo.findByRole(ROLES.ADMIN);
    if (!adminUser?._id) {
      throw new InvalidOperationException(INTERNAL_ERROR_MESSAGES.INVALID_DATA);
    }
    const adminId = adminUser._id.toString();

    const totalAmount = lock.amount;
    const commissionRate = env.COMMISSION_PERCENTAGE / 100;
    const commissionAmount = totalAmount * commissionRate;
    const hotelAmount = totalAmount - commissionAmount;
    const hotelProviderId = hotel.userId.toString();

    const booking: HotelBookingEntity = {
      hotelId: roomVariant.hotelId,
      bookingStatus: BOOKING_STATUS.CONFIRMED,
      checkinDate: lock.checkinDate,
      checkoutDate: lock.checkoutDate,
      paymentIntendId: paymentIntentId,
      travelerId: traverlerId,
      roomVariantId: lock.roomVariantId,
      totalAmount,
      paymentStatus: PAYMENT_STATUS.SUCCESS,
      isWalkIn: false,
    };

    const newBookingId = await this._hotelBookingRepo.create(booking);

    await this._walletRepo.creditWallet(
      adminId,
      SERVICE_TYPE.ADMIN,
      totalAmount,
    );

    await this._walletRepo.debitWallet(
      adminId,
      SERVICE_TYPE.ADMIN,
      hotelAmount,
    );
    await this._walletRepo.creditWallet(
      hotelProviderId,
      SERVICE_TYPE.HOTEL,
      hotelAmount,
    );

    await this._transactionRepo.create({
      bookingId: newBookingId,
      ownerType: SERVICE_TYPE.USER,
      ownerId: traverlerId,
      amount: totalAmount,
      type: TRANSACTION_TYPE.PAYMENT,
      paymentMethod: PAYMENT_METHOD.STRIPE,
      description: `Hotel booking payment for ${hotel.name}`,
    });

    await this._transactionRepo.create({
      bookingId: newBookingId,
      ownerType: SERVICE_TYPE.ADMIN,
      ownerId: adminId,
      amount: totalAmount,
      commissionRate: env.COMMISSION_PERCENTAGE,
      commissionAmount,
      type: TRANSACTION_TYPE.SERVICE_CREDIT,
      paymentMethod: PAYMENT_METHOD.STRIPE,
      description: `Hotel booking received for ${hotel.name}`,
    });

    await this._transactionRepo.create({
      bookingId: newBookingId,
      ownerType: SERVICE_TYPE.ADMIN,
      ownerId: adminId,
      amount: hotelAmount,
      type: TRANSACTION_TYPE.WALLET_DEBIT,
      paymentMethod: PAYMENT_METHOD.STRIPE,
      description: `Payout to hotel for ${hotel.name}`,
    });

    await this._transactionRepo.create({
      bookingId: newBookingId,
      ownerType: SERVICE_TYPE.HOTEL,
      ownerId: hotelProviderId,
      amount: hotelAmount,
      commissionRate: env.COMMISSION_PERCENTAGE,
      commissionAmount,
      type: TRANSACTION_TYPE.WALLET_CREDIT,
      paymentMethod: PAYMENT_METHOD.STRIPE,
      description: `Booking payout for ${hotel.name}`,
    });

    await this._roomLockRepo.deleteById(lock._id!);

    return Messages.PAYMENT_VERIFIED_SUCCESSFULLY;
  }
}
