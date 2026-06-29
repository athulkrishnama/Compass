import { DriverPastTripResponseDTO } from "@domain/dtos/ride/driverPastTrip.dto";

export interface IGetDriverPastTripsUseCase {
  execute(
    driverId: string,
    page: number,
    limit: number,
  ): Promise<{ trips: DriverPastTripResponseDTO[]; total: number }>;
}
