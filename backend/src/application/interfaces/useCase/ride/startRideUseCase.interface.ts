import { IStartRideRequestDTO } from "@domain/dtos/ride/startRide.dto";

export interface IStartRideUseCase {
  execute(dto: IStartRideRequestDTO): Promise<void>;
}
