import { inject, injectable } from "tsyringe";
import { IProcessWalletCabPaymentUseCase } from "@application/interfaces/useCase/cabPayment/IProcessWalletCabPaymentUseCase";
import { IRideRepo } from "@application/interfaces/repository/ride/ride.repo.interface";
import { ISocketEmitter } from "@application/interfaces/service/socketEmitter.interface";
import { ITransactionManager } from "@application/interfaces/service/ITransactionManager";
import { WalletPaymentProcessor } from "@useCases/cabPayment/strategies/WalletPaymentProcessor";
import { PAYMENT_STATUS } from "@domain/enums/paymentStatus";
import { PAYMENT_METHOD } from "@domain/enums/paymentMethod";
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

@injectable()
export class ProcessWalletCabPaymentUseCase
  implements IProcessWalletCabPaymentUseCase
{
  constructor(
    @inject("IRideRepo") private _rideRepo: IRideRepo,
    @inject("WalletPaymentProcessor")
    private _walletProcessor: WalletPaymentProcessor,
    @inject("ISocketEmitter") private _socketEmitter: ISocketEmitter,
    @inject("ITransactionManager")
    private _transactionManager: ITransactionManager,
  ) {}

  async execute(tripId: string, riderId: string): Promise<void> {
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

    if (ride.paymentMethod !== PAYMENT_METHOD.WALLET) {
      throw new InvalideDataException(
        INTERNAL_ERROR_MESSAGES.INVALID_PAYMENT_METHOD,
      );
    }

    if (!ride.driver_id) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.DRIVER_NOT_FOUND,
      );
    }

    const session = await this._transactionManager.startSession();
    try {
      await this._transactionManager.withTransaction(session, async () => {
        await this._walletProcessor.processPayment(ride, session);
        await this._rideRepo.update(ride, tripId);
      });
    } finally {
      this._transactionManager.endSession(session);
    }

    this._socketEmitter.emitToUser(riderId, SocketEvents.RIDER_EVENTS, {
      type: RIDER_EVENTS_TYPES.COMPLETED,
      payload: { tripId, event: SocketEvents.PAYMENT_SUCCESS },
    });

    this._socketEmitter.emitToUser(ride.driver_id, SocketEvents.DRIVER_EVENTS, {
      type: DRIVER_EVENTS_TYPES.COMPLETED,
      payload: { tripId, event: SocketEvents.PAYMENT_RECEIVED },
    });
  }
}
