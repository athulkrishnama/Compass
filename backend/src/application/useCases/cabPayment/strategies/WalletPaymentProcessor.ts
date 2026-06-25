import { IPaymentProcessor } from "@application/interfaces/service/IPaymentProcessor";
import { IWalletRepo } from "@application/interfaces/repository/wallet/wallet.repo.interface";
import { ITransactionRepo } from "@application/interfaces/repository/transaction/transaction.repo.interface";
import { RideEntity } from "@domain/entities/ride/ride.entity";
import { IInitiateCabPaymentResponseDTO } from "@domain/dtos/cabPayment/initiateCabPayment.dto";
import { PAYMENT_METHOD } from "@domain/enums/paymentMethod";
import { PAYMENT_STATUS } from "@domain/enums/paymentStatus";
import { SERVICE_TYPE } from "@domain/enums/serviceType";
import { TRANSACTION_TYPE } from "@domain/enums/transactionType";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { InvalidOperationException } from "@application/constants/Exceptions";
import { env } from "@config/envConfig";
import { injectable, inject } from "tsyringe";
import { IDbSession } from "@application/interfaces/repository/base/dbSession.interface";

@injectable()
export class WalletPaymentProcessor implements IPaymentProcessor {
  constructor(
    @inject("IWalletRepo") private _walletRepo: IWalletRepo,
    @inject("ITransactionRepo") private _transactionRepo: ITransactionRepo,
  ) {}

  async initiatePayment(
    ride: RideEntity,
    riderId: string,
  ): Promise<IInitiateCabPaymentResponseDTO> {
    const riderWallet = await this._walletRepo.findByOwner(
      riderId,
      SERVICE_TYPE.USER,
    );

    const fare = ride.selected_fare.fare;

    if (!riderWallet || riderWallet.balance < fare) {
      throw new InvalidOperationException(
        INTERNAL_ERROR_MESSAGES.INSUFFICIENT_WALLET_BALANCE,
      );
    }

    return {
      paymentMethod: PAYMENT_METHOD.WALLET,
      amount: fare,
      currency: "inr",
    };
  }

  async processPayment(ride: RideEntity, session: IDbSession): Promise<void> {
    const fare = ride.selected_fare.fare;
    const commissionRate = env.COMMISSION_PERCENTAGE / 100;
    const commissionAmount = fare * commissionRate;
    const driverAmount = fare - commissionAmount;

    const riderId = ride.rider_id;
    const driverId = ride.driver_id!;

    await this._walletRepo.debitWallet(
      riderId,
      SERVICE_TYPE.USER,
      fare,
      session,
    );

    await this._walletRepo.creditWallet(
      driverId,
      SERVICE_TYPE.CAB,
      driverAmount,
      session,
    );

    await this._transactionRepo.createInSession(
      {
        bookingId: ride._id,
        userId: riderId,
        driverId,
        serviceType: SERVICE_TYPE.CAB,
        providerId: driverId,
        paymentMethod: PAYMENT_METHOD.WALLET,
        amount: fare,
        type: TRANSACTION_TYPE.WALLET_DEBIT,
        description: `Wallet debit for trip ${ride._id}`,
      },
      session,
    );

    await this._transactionRepo.createInSession(
      {
        bookingId: ride._id,
        userId: riderId,
        driverId,
        serviceType: SERVICE_TYPE.CAB,
        providerId: driverId,
        paymentMethod: PAYMENT_METHOD.WALLET,
        amount: driverAmount,
        commissionRate: env.COMMISSION_PERCENTAGE,
        commissionAmount,
        type: TRANSACTION_TYPE.WALLET_CREDIT,
        description: `Driver credit for trip ${ride._id}`,
      },
      session,
    );

    ride.paymentStatus = PAYMENT_STATUS.SUCCESS;
    ride.paymentMethod = PAYMENT_METHOD.WALLET;
    ride.remainingAmount = 0;
  }
}
