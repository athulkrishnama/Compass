import { inject, injectable } from "tsyringe";
import { IRecordCashPaymentUseCase } from "@application/interfaces/useCase/cabPayment/IRecordCashPaymentUseCase";
import { IRideRepo } from "@application/interfaces/repository/ride/ride.repo.interface";
import { IWalletRepo } from "@application/interfaces/repository/wallet/wallet.repo.interface";
import { ITransactionRepo } from "@application/interfaces/repository/transaction/transaction.repo.interface";
import { IUserRepo } from "@application/interfaces/repository/users/user.repo.interface";
import { ICabRepo } from "@application/interfaces/repository/cab/cab.repo.interface";
import { ISocketEmitter } from "@application/interfaces/service/socketEmitter.interface";
import { ITransactionManager } from "@application/interfaces/service/ITransactionManager";
import {
  IRecordCashPaymentRequestDTO,
  IRecordCashPaymentResponseDTO,
} from "@domain/dtos/cabPayment/recordCashPayment.dto";
import { PAYMENT_METHOD } from "@domain/enums/paymentMethod";
import { PAYMENT_STATUS } from "@domain/enums/paymentStatus";
import { SERVICE_TYPE } from "@domain/enums/serviceType";
import { TRANSACTION_TYPE } from "@domain/enums/transactionType";
import { RIDE_STATUSES } from "@domain/types/rideStatus";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import {
  InvalideDataException,
  InvalidOperationException,
  ResourceNotFoundException,
} from "@application/constants/Exceptions";
import { SocketEvents } from "@presentation/constants/socketEvents";
import {
  DRIVER_EVENTS_TYPES,
  RIDER_EVENTS_TYPES,
} from "@domain/types/socketPayloads";
import { env } from "@config/envConfig";
import { ROLES } from "@domain/enums/roles";

@injectable()
export class RecordCashPaymentUseCase implements IRecordCashPaymentUseCase {
  constructor(
    @inject("IRideRepo") private _rideRepo: IRideRepo,
    @inject("IWalletRepo") private _walletRepo: IWalletRepo,
    @inject("ITransactionRepo") private _transactionRepo: ITransactionRepo,
    @inject("IUserRepo") private _userRepo: IUserRepo,
    @inject("ISocketEmitter") private _socketEmitter: ISocketEmitter,
    @inject("ICabRepo") private _cabRepo: ICabRepo,
    @inject("ITransactionManager")
    private _transactionManager: ITransactionManager,
  ) {}

  async execute(
    dto: IRecordCashPaymentRequestDTO,
  ): Promise<IRecordCashPaymentResponseDTO> {
    const { tripId, driverId, amountReceived } = dto;

    const ride = await this._rideRepo.findById(tripId);
    if (!ride) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.RIDE_NOT_FOUND,
      );
    }

    if (ride.status !== RIDE_STATUSES.COMPLETED) {
      throw new InvalideDataException(
        INTERNAL_ERROR_MESSAGES.TRIP_NOT_COMPLETED,
      );
    }

    if (ride.paymentStatus === PAYMENT_STATUS.SUCCESS) {
      throw new InvalidOperationException(
        INTERNAL_ERROR_MESSAGES.PAYMENT_ALREADY_SUCCESSFUL,
      );
    }

    if (ride.driver_id !== driverId) {
      throw new InvalideDataException(INTERNAL_ERROR_MESSAGES.UNAUTHORIZED);
    }

    const fare = ride.selected_fare.fare;
    const commissionRate = env.COMMISSION_PERCENTAGE / 100;
    const commissionAmount = fare * commissionRate;

    if (amountReceived < fare) {
      throw new InvalideDataException(
        INTERNAL_ERROR_MESSAGES.INSUFFICIENT_PAYMENT_AMOUNT,
      );
    }

    const change = amountReceived > fare ? amountReceived - fare : 0;

    const adminUser = await this._userRepo.findByRole(ROLES.ADMIN);
    if (!adminUser?._id) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.USER_NOT_FOUND,
      );
    }
    const adminId = adminUser._id.toString();

    const session = await this._transactionManager.startSession();

    try {
      await this._transactionManager.withTransaction(session, async () => {
        await this._walletRepo.debitWallet(
          driverId,
          SERVICE_TYPE.CAB,
          commissionAmount,
          session,
        );

        await this._walletRepo.creditWallet(
          adminId,
          SERVICE_TYPE.ADMIN,
          commissionAmount,
          session,
        );

        await this._transactionRepo.createInSession(
          {
            bookingId: tripId,
            ownerType: SERVICE_TYPE.CAB,
            ownerId: driverId,
            paymentMethod: PAYMENT_METHOD.CASH,
            amount: commissionAmount,
            commissionRate: env.COMMISSION_PERCENTAGE,
            commissionAmount,
            type: TRANSACTION_TYPE.COMMISSION_DEBIT,
            description: `Commission deducted for trip ${tripId}`,
          },
          session,
        );

        await this._transactionRepo.createInSession(
          {
            bookingId: tripId,
            ownerType: SERVICE_TYPE.ADMIN,
            ownerId: adminId,
            paymentMethod: PAYMENT_METHOD.CASH,
            amount: commissionAmount,
            commissionRate: env.COMMISSION_PERCENTAGE,
            commissionAmount,
            type: TRANSACTION_TYPE.COMMISSION,
            description: `Commission received for trip ${tripId}`,
          },
          session,
        );

        if (change > 0) {
          await this._walletRepo.debitWallet(
            driverId,
            SERVICE_TYPE.CAB,
            change,
            session,
          );

          await this._walletRepo.creditWallet(
            ride.rider_id,
            SERVICE_TYPE.USER,
            change,
            session,
          );

          await this._transactionRepo.createInSession(
            {
              bookingId: tripId,
              ownerType: SERVICE_TYPE.USER,
              ownerId: ride.rider_id,
              paymentMethod: PAYMENT_METHOD.CASH,
              amount: change,
              type: TRANSACTION_TYPE.WALLET_CREDIT,
              description: `Change returned for trip ${tripId}`,
            },
            session,
          );

          await this._transactionRepo.createInSession(
            {
              bookingId: tripId,
              ownerType: SERVICE_TYPE.CAB,
              ownerId: driverId,
              paymentMethod: PAYMENT_METHOD.CASH,
              amount: change,
              type: TRANSACTION_TYPE.WALLET_DEBIT,
              description: `Change returned to rider for trip ${tripId}`,
            },
            session,
          );
        }

        ride.paymentStatus = PAYMENT_STATUS.SUCCESS;
        ride.paymentMethod = PAYMENT_METHOD.CASH;
        ride.remainingAmount = 0;
        await this._rideRepo.update(ride, tripId);

        await this._cabRepo.updateActiveRide(driverId, null, session);
      });
    } finally {
      this._transactionManager.endSession(session);
    }

    this._socketEmitter.emitToUser(ride.rider_id, SocketEvents.RIDER_EVENTS, {
      type: RIDER_EVENTS_TYPES.PAYMENT_SUCCESS,
      payload: { ride_id: tripId, event: SocketEvents.PAYMENT_SUCCESS },
    });

    this._socketEmitter.emitToUser(driverId, SocketEvents.DRIVER_EVENTS, {
      type: DRIVER_EVENTS_TYPES.PAYMENT_RECEIVED,
      payload: { ride_id: tripId, event: SocketEvents.PAYMENT_RECEIVED },
    });

    return {
      status: PAYMENT_STATUS.SUCCESS,
      changeReturned: change > 0 ? change : undefined,
    };
  }
}
