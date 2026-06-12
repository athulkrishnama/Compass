import { IAcceptRideRequestDTO } from "@domain/dtos/ride/acceptRide.dto";

export interface IAcceptRideUseCase {
  execute(dto: IAcceptRideRequestDTO): Promise<void>;
}
