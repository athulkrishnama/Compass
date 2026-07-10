import { inject, injectable } from "tsyringe";
import { ICancelBookingUseCase } from "@application/interfaces/useCase/hotelBooking/ICancelBookingUseCase";
import { IHotelBookingRepo } from "@application/interfaces/repository/hotelBooking/hotelBooking.repo.interface";
import { IPaymentService } from "@application/interfaces/service/paymentService.interface";
import { ITransactionRepo } from "@application/interfaces/repository/transaction/transaction.repo.interface";
import { IUserRepo } from "@application/interfaces/repository/users/user.repo.interface";
import {
  InvalidOperationException,
  ResourceNotFoundException,
} from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { BOOKING_STATUS } from "@domain/enums/bookingStatus";
import { REFUND_STATUS } from "@domain/enums/refundStatus";
import { calculateRefundAmount } from "@domain/constants/cancellationPolicy";
import { TRANSACTION_TYPE } from "@domain/enums/transactionType";
import { SERVICE_TYPE } from "@domain/enums/serviceType";
import { PAYMENT_METHOD } from "@domain/enums/paymentMethod";
import { ROLES } from "@domain/enums/roles";
import { INotificationService } from "@application/interfaces/service/notificationService.interface";
import { NOTIFICATION_TYPES } from "@domain/types/notificationType";

@injectable()
export class CancelBookingUseCase implements ICancelBookingUseCase {
  constructor(
    @inject("IHotelBookingRepo")
    private _hotelBookingRepo: IHotelBookingRepo,
    @inject("IPaymentService")
    private _paymentService: IPaymentService,
    @inject("ITransactionRepo")
    private _transactionRepo: ITransactionRepo,
    @inject("IUserRepo")
    private _userRepo: IUserRepo,
    @inject("INotificationService")
    private _notificationService: INotificationService,
  ) {}

  async execute(
    bookingId: string,
    travelerId: string,
  ): Promise<{ refundAmount: number; refundPercentage: number }> {
    const booking = await this._hotelBookingRepo.findById(bookingId);

    if (!booking) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.BOOKING_NOT_FOUND,
      );
    }

    if (booking.travelerId !== travelerId) {
      throw new InvalidOperationException(
        INTERNAL_ERROR_MESSAGES.USER_IS_NOT_AUTHORIZED,
      );
    }

    if (booking.bookingStatus === BOOKING_STATUS.CANCELLED) {
      throw new InvalidOperationException(
        INTERNAL_ERROR_MESSAGES.BOOKING_ALREADY_CANCELLED,
      );
    }

    if (booking.bookingStatus !== BOOKING_STATUS.CONFIRMED) {
      throw new InvalidOperationException(
        INTERNAL_ERROR_MESSAGES.BOOKING_CANNOT_BE_CANCELLED,
      );
    }

    const { refundPercentage, refundAmount } = calculateRefundAmount(
      booking.checkinDate,
      booking.totalAmount,
    );

    let refundStatus = REFUND_STATUS.NONE;

    if (refundAmount > 0) {
      try {
        await this._paymentService.refundPayment(
          booking.paymentIntendId,
          refundAmount,
        );
        refundStatus = REFUND_STATUS.COMPLETED;

        const adminUser = await this._userRepo.findByRole(ROLES.ADMIN);
        if (adminUser && adminUser._id) {
          await this._transactionRepo.create({
            bookingId,
            ownerType: SERVICE_TYPE.USER,
            ownerId: travelerId,
            amount: refundAmount,
            type: TRANSACTION_TYPE.REFUND,
            paymentMethod: PAYMENT_METHOD.STRIPE,
            description: `Refund for cancelled booking ${bookingId}`,
          });

          await this._transactionRepo.create({
            bookingId,
            ownerType: SERVICE_TYPE.ADMIN,
            ownerId: adminUser._id.toString(),
            amount: refundAmount,
            type: TRANSACTION_TYPE.REFUND,
            paymentMethod: PAYMENT_METHOD.STRIPE,
            description: `Refund issued for booking ${bookingId}`,
          });
        }
      } catch {
        refundStatus = REFUND_STATUS.FAILED;
        throw new InvalidOperationException(
          INTERNAL_ERROR_MESSAGES.REFUND_FAILED,
        );
      }
    }

    await this._hotelBookingRepo.update(
      {
        ...booking,
        bookingStatus: BOOKING_STATUS.CANCELLED,
        refundAmount,
        refundStatus,
        cancelledAt: new Date(),
      },
      bookingId,
    );

    const refundMessage =
      refundAmount > 0
        ? `A refund of ₹${refundAmount.toFixed(2)} (${refundPercentage}%) has been initiated to your original payment method.`
        : "No refund is applicable based on the cancellation policy.";

    try {
      await this._notificationService.notify(
        travelerId,
        NOTIFICATION_TYPES.BOOKING_CANCELLED,
        "Booking Cancelled",
        `Your booking has been cancelled. ${refundMessage}`,
        { bookingId, refundAmount, refundPercentage },
      );
    } catch (notifyErr) {
      console.error(
        "[CancelBookingUseCase] Failed to send cancellation notification:",
        notifyErr,
      );
    }

    return { refundAmount, refundPercentage };
  }
}
