import { IEndRideRequestDTO } from "@domain/dtos/ride/endRide.dto";

export interface IEndRideUseCase {
  execute(dto: IEndRideRequestDTO): Promise<void>;
}
