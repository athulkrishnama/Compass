import { createRideRequestDTO } from "@domain/dtos/ride/createRide.dto";

export interface ICreateRideUseCase {
  execute(data: createRideRequestDTO): Promise<string>;
}
