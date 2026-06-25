import { inject, injectable } from "tsyringe";
import { IInitiateCabPaymentUseCase } from "@application/interfaces/useCase/cabPayment/IInitiateCabPaymentUseCase";
import { IRideRepo } from "@application/interfaces/repository/ride/ride.repo.interface";
import { IPaymentProcessor } from "@application/interfaces/service/IPaymentProcessor";
import { WalletPaymentProcessor } from "@useCases/cabPayment/strategies/WalletPaymentProcessor";
import { StripePaymentProcessor } from "@useCases/cabPayment/strategies/StripePaymentProcessor";
import { CashPaymentProcessor } from "@useCases/cabPayment/strategies/CashPaymentProcessor";
import { ISocketEmitter } from "@application/interfaces/service/socketEmitter.interface";
import {
  IInitiateCabPaymentRequestDTO,
  IInitiateCabPaymentResponseDTO,
} from "@domain/dtos/cabPayment/initiateCabPayment.dto";
import { PAYMENT_METHOD } from "@domain/enums/paymentMethod";
import { PAYMENT_STATUS } from "@domain/enums/paymentStatus";
import { RIDE_STATUSES } from "@domain/types/rideStatus";
import { SocketEvents } from "@presentation/constants/socketEvents";
import { DRIVER_EVENTS_TYPES } from "@domain/types/socketPayloads";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import {
  InvalideDataException,
  InvalidOperationException,
  ResourceNotFoundException,
} from "@application/constants/Exceptions";

@injectable()
export class InitiateCabPaymentUseCase implements IInitiateCabPaymentUseCase {
  private readonly _processors: Record<PAYMENT_METHOD, IPaymentProcessor>;

  constructor(
    @inject("IRideRepo") private _rideRepo: IRideRepo,
    @inject("ISocketEmitter") private _socketEmitter: ISocketEmitter,
    @inject("WalletPaymentProcessor")
    walletProcessor: WalletPaymentProcessor,
    @inject("StripePaymentProcessor")
    stripeProcessor: StripePaymentProcessor,
    @inject("CashPaymentProcessor")
    cashProcessor: CashPaymentProcessor,
  ) {
    this._processors = {
      [PAYMENT_METHOD.WALLET]: walletProcessor,
      [PAYMENT_METHOD.STRIPE]: stripeProcessor,
      [PAYMENT_METHOD.CASH]: cashProcessor,
    };
  }

  async execute(
    dto: IInitiateCabPaymentRequestDTO,
  ): Promise<IInitiateCabPaymentResponseDTO> {
    const { tripId, riderId, paymentMethod } = dto;

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

    const processor = this._processors[paymentMethod];
    if (!processor) {
      throw new InvalideDataException(
        INTERNAL_ERROR_MESSAGES.INVALID_PAYMENT_METHOD,
      );
    }

    const result = await processor.initiatePayment(ride, riderId);

    ride.paymentStatus = PAYMENT_STATUS.PROCESSING;
    ride.paymentMethod = paymentMethod;
    await this._rideRepo.update(ride, tripId);

    if (ride.driver_id) {
      this._socketEmitter.emitToUser(
        ride.driver_id,
        SocketEvents.DRIVER_EVENTS,
        {
          type: DRIVER_EVENTS_TYPES.PAYMENT_INITIATED,
          payload: { ride_id: tripId, event: SocketEvents.PAYMENT_INITIATED },
        },
      );
    }

    return result;
  }
}
