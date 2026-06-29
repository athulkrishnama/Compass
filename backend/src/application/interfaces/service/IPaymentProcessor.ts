import { RideEntity } from "@domain/entities/ride/ride.entity";
import { IInitiateCabPaymentResponseDTO } from "@domain/dtos/cabPayment/initiateCabPayment.dto";
import { IDbSession } from "@application/interfaces/repository/base/dbSession.interface";

export interface IPaymentProcessor {
  initiatePayment(
    ride: RideEntity,
    riderId: string,
  ): Promise<IInitiateCabPaymentResponseDTO>;
  processPayment(ride: RideEntity, session: IDbSession): Promise<void>;
}
