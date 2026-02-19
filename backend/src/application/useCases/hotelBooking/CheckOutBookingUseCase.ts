import { inject, injectable } from "tsyringe";
import { ICheckOutBookingUseCase } from "@application/interfaces/useCase/hotelBooking/ICheckOutBookingUseCase";
import { IHotelBookingRepo } from "@application/interfaces/repository/hotelBooking/hotelBooking.repo.interface";
import { IWalletRepo } from "@application/interfaces/repository/wallet/wallet.repo.interface";
import { ITransactionRepo } from "@application/interfaces/repository/transaction/transaction.repo.interface";
import { IHotelRepo } from "@application/interfaces/repository/hotel/hotel.repo.interface";
import {
  InvalidOperationException,
  ResourceNotFoundException,
} from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { BOOKING_STATUS } from "@domain/enums/bookingStatus";
import { TRANSACTION_TYPE } from "@domain/enums/transactionType";
import { SERVICE_TYPE } from "@domain/enums/serviceType";
import { env } from "@config/envConfig";

@injectable()
export class CheckOutBookingUseCase implements ICheckOutBookingUseCase {
  constructor(
    @inject("IHotelBookingRepo")
    private _hotelBookingRepo: IHotelBookingRepo,
    @inject("IWalletRepo")
    private _walletRepo: IWalletRepo,
    @inject("ITransactionRepo")
    private _transactionRepo: ITransactionRepo,
    @inject("IHotelRepo")
    private _hotelRepo: IHotelRepo,
  ) {}

  async execute(bookingId: string, hotelId: string): Promise<void> {
    const booking = await this._hotelBookingRepo.findById(bookingId);

    if (!booking) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.BOOKING_NOT_FOUND,
      );
    }

    if (booking.hotelId !== hotelId) {
      throw new InvalidOperationException(INTERNAL_ERROR_MESSAGES.NOT_ALLOWED);
    }

    if (booking.bookingStatus !== BOOKING_STATUS.CHECKED_IN) {
      throw new InvalidOperationException(
        INTERNAL_ERROR_MESSAGES.CHECKOUT_NOT_ALLOWED,
      );
    }

    await this._hotelBookingRepo.update(
      {
        ...booking,
        bookingStatus: BOOKING_STATUS.COMPLETED,
      },
      bookingId,
    );

    const hotel = await this._hotelRepo.findById(hotelId);
    if (!hotel) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.HOTEL_NOT_FOUND,
      );
    }

    const commissionRate = env.COMMISSION_PERCENTAGE;
    const totalAmount = booking.totalAmount;
    const commissionAmount = (totalAmount * commissionRate) / 100;
    const providerAmount = totalAmount - commissionAmount;

    await this._transactionRepo.create({
      bookingId,
      userId: hotel.userId.toString(),
      serviceType: SERVICE_TYPE.HOTEL,
      providerId: hotel.userId.toString(),
      amount: totalAmount,
      commissionRate,
      commissionAmount,
      providerAmount,
      type: TRANSACTION_TYPE.SERVICE_CREDIT,
    });

    await this._walletRepo.creditWallet(
      hotel.userId.toString(),
      SERVICE_TYPE.HOTEL,
      providerAmount,
    );
  }
}
