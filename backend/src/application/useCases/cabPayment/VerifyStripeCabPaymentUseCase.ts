import { inject, injectable } from "tsyringe";
import { IVerifyStripeCabPaymentUseCase } from "@application/interfaces/useCase/cabPayment/IVerifyStripeCabPaymentUseCase";
import { IRideRepo } from "@application/interfaces/repository/ride/ride.repo.interface";
import { ISocketEmitter } from "@application/interfaces/service/socketEmitter.interface";
import { ITransactionManager } from "@application/interfaces/service/ITransactionManager";
import { StripePaymentProcessor } from "@useCases/cabPayment/strategies/StripePaymentProcessor";
import { PAYMENT_STATUS } from "@domain/enums/paymentStatus";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { ResourceNotFoundException } from "@application/constants/Exceptions";
import { SocketEvents } from "@presentation/constants/socketEvents";
import {
  DRIVER_EVENTS_TYPES,
  RIDER_EVENTS_TYPES,
} from "@domain/types/socketPayloads";

@injectable()
export class VerifyStripeCabPaymentUseCase
  implements IVerifyStripeCabPaymentUseCase
{
  constructor(
    @inject("IRideRepo") private _rideRepo: IRideRepo,
    @inject("StripePaymentProcessor")
    private _stripeProcessor: StripePaymentProcessor,
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

    if (ride.paymentStatus === PAYMENT_STATUS.SUCCESS) {
      return;
    }

    if (!ride.driver_id) {
      throw new ResourceNotFoundException(
        INTERNAL_ERROR_MESSAGES.DRIVER_NOT_FOUND,
      );
    }

    const session = await this._transactionManager.startSession();
    try {
      await this._transactionManager.withTransaction(session, async () => {
        await this._stripeProcessor.processPayment(ride, session);
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
