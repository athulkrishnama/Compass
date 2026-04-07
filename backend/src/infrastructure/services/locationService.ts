import { ILocationService } from "@application/interfaces/service/locationService.interface";
import { Coordinate } from "@domain/types/coordinate";
import { env } from "@config/envConfig";
import { InvalideDataException } from "@application/constants/Exceptions";
import { INTERNAL_ERROR_MESSAGES } from "@domain/enums/internalErrorMessages";
import { injectable } from "tsyringe";

@injectable()
export class LocationService implements ILocationService {
  async getDistanceAndTime(
    pickup: Coordinate,
    dropoff: Coordinate,
  ): Promise<{ distance: number; time: number }> {
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup.longitude},${pickup.latitude};${dropoff.longitude},${dropoff.latitude}?access_token=${env.MAPBOX_ACCESS_TOKEN}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new InvalideDataException(
          INTERNAL_ERROR_MESSAGES.DISTANCE_FETCHING_FAILED,
        );
      }

      const data = await response.json();

      if (!data.routes || data.routes.length === 0) {
        throw new InvalideDataException(
          INTERNAL_ERROR_MESSAGES.DISTANCE_FETCHING_FAILED,
        );
      }

      const route = data.routes[0];

      return {
        distance: route.distance,
        time: route.duration,
      };
    } catch (error) {
      console.error("Error fetching mapbox direction:", error);
      throw error;
    }
  }
}
