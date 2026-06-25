import { RiderPastTripResponseDTO } from "@domain/dtos/ride/riderPastTrip.dto";

export interface IGetRiderPastTripsUseCase {
  execute(
    riderId: string,
    page: number,
    limit: number,
  ): Promise<{ trips: RiderPastTripResponseDTO[]; total: number }>;
}
