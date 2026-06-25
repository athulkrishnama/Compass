import { IPaymentProcessor } from "@application/interfaces/service/IPaymentProcessor";
import { RideEntity } from "@domain/entities/ride/ride.entity";
import { IInitiateCabPaymentResponseDTO } from "@domain/dtos/cabPayment/initiateCabPayment.dto";
import { PAYMENT_METHOD } from "@domain/enums/paymentMethod";
import { PAYMENT_STATUS } from "@domain/enums/paymentStatus";
import { injectable } from "tsyringe";

@injectable()
export class CashPaymentProcessor implements IPaymentProcessor {
  async initiatePayment(
    ride: RideEntity,
  ): Promise<IInitiateCabPaymentResponseDTO> {
    return {
      paymentMethod: PAYMENT_METHOD.CASH,
      amount: ride.selected_fare.fare,
      currency: "inr",
    };
  }

  async processPayment(ride: RideEntity): Promise<void> {
    ride.paymentStatus = PAYMENT_STATUS.PROCESSING;
    ride.paymentMethod = PAYMENT_METHOD.CASH;
  }
}
