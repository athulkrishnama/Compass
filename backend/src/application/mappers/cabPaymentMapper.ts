import { RideEntity } from "@domain/entities/ride/ride.entity";
import { ICabPaymentStatusResponseDTO } from "@domain/dtos/cabPayment/cabPaymentStatus.dto";
import { PAYMENT_STATUS } from "@domain/enums/paymentStatus";

export class CabPaymentMapper {
  static toCabPaymentStatusResponseDTO(
    ride: RideEntity,
    tripId: string,
  ): ICabPaymentStatusResponseDTO {
    return {
      tripId,
      paymentStatus: ride.paymentStatus ?? PAYMENT_STATUS.PENDING,
      paymentMethod: ride.paymentMethod,
      totalFare: ride.selected_fare.fare,
      remainingAmount: ride.remainingAmount ?? 0,
    };
  }
}
