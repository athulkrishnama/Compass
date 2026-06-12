import { ICancelRideRequestDTO } from "@domain/dtos/ride/cancelRide.dto";

export interface ICancelRideUseCase {
  execute(dto: ICancelRideRequestDTO): Promise<void>;
}
